import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

enum RoleType {
  OWNER = 'OWNER',
  USER = 'USER',
}

async function seedRoles() {
  console.log('Seeding roles...');
  await prisma.role.createMany({
    data: [
      {
        name: 'Owner',
        type: RoleType.OWNER,
        isDefault: true,
      },
      {
        name: 'User',
        type: RoleType.USER,
        isDefault: true,
      },
    ],
    skipDuplicates: true, // Prevent duplicate seeding
  });
}

async function seedUsers() {
  console.log('Seeding users...');
  const OwnerRole = await prisma.role.findFirst({
    where: { type: RoleType.OWNER },
  });
  const UserRole = await prisma.role.findFirst({
    where: { type: RoleType.USER },
  });

  const password = await bcrypt.hash('Password123#', 10);

  // Create users with roles
  await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      const user = await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: password,
          imageUrl: faker.image.avatar(),
        },
      });

      // Assign a role to the user
      await prisma.roleUser.create({
        data: {
          userId: user.id,
          roleId: faker.helpers.arrayElement([OwnerRole.id, UserRole.id]),
        },
      });
    }),
  );
}

async function seedBlogs() {
  console.log('Seeding blogs...');
  const users = await prisma.user.findMany();

  await Promise.all(
    Array.from({ length: 20 }).map(async () => {
      const randomUser = faker.helpers.arrayElement(users) as { id: string };
      await prisma.blog.create({
        data: {
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(3),
          userId: randomUser.id,
        },
      });
    }),
  );
}

async function seedComments() {
  console.log('Seeding comments...');
  const blogs = await prisma.blog.findMany();
  const users = await prisma.user.findMany();

  await Promise.all(
    Array.from({ length: 50 }).map(async () => {
      const randomBlog = faker.helpers.arrayElement(blogs) as { id: string };
      const randomUser = faker.helpers.arrayElement(users) as { id: string };

      await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          blogId: randomBlog.id,
          userId: randomUser.id,
        },
      });
    }),
  );
}

async function seedLikes() {
  console.log('Seeding likes...');
  const blogs = await prisma.blog.findMany();
  const comments = await prisma.comment.findMany();
  const users = await prisma.user.findMany();

  // Seed likes for blogs
  await Promise.all(
    Array.from({ length: 30 }).map(async () => {
      const randomBlog = faker.helpers.arrayElement(blogs) as { id: string };
      const randomUser = faker.helpers.arrayElement(users) as { id: string };

      await prisma.like.upsert({
        where: {
          userId_blogId: { userId: randomUser.id, blogId: randomBlog.id },
        },
        update: {}, // If the record already exists, do nothing.
        create: {
          userId: randomUser.id,
          blogId: randomBlog.id,
        },
      });
    }),
  );

  // Seed likes for comments
  await Promise.all(
    Array.from({ length: 30 }).map(async () => {
      const randomComment = faker.helpers.arrayElement(comments) as {
        id: string;
      };
      const randomUser = faker.helpers.arrayElement(users) as { id: string };

      await prisma.like.create({
        data: {
          userId: randomUser.id,
          commentId: randomComment.id,
        },
      });
    }),
  );
}

async function main() {
  await seedRoles();
  await seedUsers();
  await seedBlogs();
  await seedComments();
  await seedLikes();
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
