import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    const [blogs, total] = await this.prisma.$transaction([
      this.prisma.blog.findMany({
        take: limit,
        skip: (page - 1) * limit,
        include: {
          User: true,
          Category: true,
          comments: true,
          likes: true,
        },
      }),
      this.prisma.blog.count(),
    ]);

    return {
      data: blogs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
      include: { User: true, Category: true, comments: true, likes: true },
    });
    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }
}
