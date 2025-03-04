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
        isDefault: false,
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

  const ownerRole = await prisma.role.findFirst({
    where: { type: RoleType.OWNER },
  });
  const userRole = await prisma.role.findFirst({
    where: { type: RoleType.USER },
  });

  const password = await bcrypt.hash('Password123#', 10);

  // Create the Owner (only one)
  const owner = await prisma.user.create({
    data: {
      name: 'Owner User',
      email: 'owner@example.com',
      password: password,
      imageUrl: faker.image.avatar(),
      RoleUser: {
        create: {
          roleId: ownerRole.id,
        },
      },
    },
  });

  // Create 9 other Users (Regular Users)
  const users = await Promise.all(
    Array.from({ length: 9 }).map(async () => {
      return prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: password,
          imageUrl: faker.image.avatar(),
          RoleUser: {
            create: {
              roleId: userRole.id,
            },
          },
        },
      });
    }),
  );

  return { owner, users };
}

async function seedBlogs(owner) {
  console.log('Seeding blogs...');

  const blogs = await Promise.all(
    Array.from({ length: 5 }).map(async () => {
      return prisma.blog.create({
        data: {
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(3),
          userId: owner.id, // Only the owner can create blogs
        },
      });
    }),
  );

  return blogs;
}

async function seedComments(users, blogs) {
  console.log('Seeding comments...');

  const comments = await Promise.all(
    users.flatMap((user) =>
      blogs.map(async (blog) => {
        return prisma.comment.create({
          data: {
            content: faker.lorem.sentence(),
            blogId: blog.id,
            userId: user.id, // Users comment on owner's blogs
          },
        });
      }),
    ),
  );

  return comments;
}

async function seedRepliesAndLikes(owner, comments) {
  console.log('Seeding replies and likes...');

  await Promise.all(
    comments.map(async (comment) => {
      // The Owner replies to each user's comment
      await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          blogId: comment.blogId,
          userId: owner.id, // Owner replies
          parentId: comment.id,
        },
      });

      // The Owner likes the user's comment
      await prisma.like.create({
        data: {
          userId: owner.id,
          commentId: comment.id,
        },
      });

      // The User likes the Owner's blog
      await prisma.like.create({
        data: {
          userId: comment.userId, // The user who made the comment
          blogId: comment.blogId,
        },
      });
    }),
  );
}

async function main() {
  await seedRoles();
  const { owner, users } = await seedUsers();
  const blogs = await seedBlogs(owner);
  const comments = await seedComments(users, blogs);
  await seedRepliesAndLikes(owner, comments);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
