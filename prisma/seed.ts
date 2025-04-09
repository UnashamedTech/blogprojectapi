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
      { name: 'Owner', type: RoleType.OWNER, isDefault: false },
      { name: 'User', type: RoleType.USER, isDefault: true },
    ],
    skipDuplicates: true,
  });
}

async function seedCategories() {
  console.log('Seeding categories...');
  const categories = [
    {
      title: 'Faith',
      description: 'Posts about faith and spirituality',
    },
    {
      title: 'Fun',
      description: 'Fun and entertaining posts',
    },
    {
      title: 'Daily Post',
      description: 'Daily updates and stories',
    },
  ];

  await prisma.category.createMany({
    data: categories,
  });

  return await prisma.category.findMany();
}

async function seedInformation() {
  console.log('Seeding information...');
  await prisma.information.create({
    data: {
      contactEmail: 'abcd@gmail.com',
      contactPhone: '+251916272791',
      location: 'Addis Ababa, Ethiopia',
    },
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

  // Create Owner
  const owner = await prisma.user.create({
    data: {
      name: 'Owner User',
      email: 'owner@example.com',
      password,
      imageUrl: faker.image.avatar(),
      roleId: ownerRole.id,
    },
  });

  // Create Users
  const users = await Promise.all(
    Array.from({ length: 9 }).map(() =>
      prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password,
          imageUrl: faker.image.avatar(),
          roleId: userRole.id,
        },
      }),
    ),
  );

  return { owner, users };
}

async function seedBlogs(owner: any, categories: any[]) {
  console.log('Seeding blogs...');

  const blogs = await Promise.all(
    Array.from({ length: 5 }).map(() => {
      const randomCategory = faker.helpers.arrayElement(categories);

      return prisma.blog.create({
        data: {
          title: faker.lorem.sentence(),
          userId: owner.id,
          location: faker.location.city(),
          categoryId: randomCategory.id,
          heroImages: {
            1: faker.image.url(),
            2: faker.image.url(),
            3: faker.image.url(),
          },
          content: {
            paragraph1: {
              id: faker.string.uuid(),
              image: faker.image.url(),
              content: faker.lorem.paragraph(),
            },
            paragraph2: {
              id: faker.string.uuid(),
              image: null,
              content: faker.lorem.paragraph(),
            },
          },
        },
      });
    }),
  );

  return blogs;
}

async function seedComments(users: any[], blogs: any[]) {
  console.log('Seeding comments...');

  const comments = await Promise.all(
    users.flatMap((user) =>
      blogs.map((blog) =>
        prisma.comment.create({
          data: {
            content: faker.lorem.sentence(),
            blogId: blog.id,
            userId: user.id,
          },
        }),
      ),
    ),
  );

  return comments;
}

async function seedRepliesAndLikes(owner: any, comments: any[]) {
  console.log('Seeding replies and likes...');

  await Promise.all(
    comments.map(async (comment) => {
      await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          blogId: comment.blogId,
          userId: owner.id,
          parentId: comment.id,
        },
      });

      await prisma.like.create({
        data: { userId: owner.id, commentId: comment.id },
      });
      await prisma.like.create({
        data: { userId: comment.userId, blogId: comment.blogId },
      });
    }),
  );
}

async function main() {
  await seedRoles();
  const categories = await seedCategories();
  await seedInformation();
  const { owner, users } = await seedUsers();
  const blogs = await seedBlogs(owner, categories);
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
