import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateBlogDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Transform each paragraph to ensure it has a generated ID
    const transformedContent: Record<string, any> = {};
    for (const [key, paragraph] of Object.entries(dto.content)) {
      transformedContent[key] = {
        id: uuidv4(),
        image: paragraph.image || null,
        content: paragraph.content,
      };
    }

    return await this.prisma.blog.create({
      data: {
        title: dto.title,
        content: transformedContent,
        location: dto.location,
        categoryId: dto.categoryId,
        userId: ownerId,
        heroImages: dto.heroImages || null,
      },
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    const [blogs, total] = await this.prisma.$transaction([
      this.prisma.blog.findMany({
        take: limit,
        skip: (page - 1) * limit,
        include: {
          User: true,
          comments: true,
          likes: true,
        },
      }),
      this.prisma.blog.count(),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: blogs,
    };
  }

  async findOne(id: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
      include: { User: true, comments: true, likes: true },
    });
    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  async update(ownerId: string, blogId: string, dto: UpdateBlogDto) {
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) throw new NotFoundException('Blog not found');
    if (blog.userId !== ownerId)
      throw new ForbiddenException('Not authorized to update this blog');

    return await this.prisma.blog.update({
      where: { id: blogId },
      data: {
        ...dto,
        heroImages: dto.heroImages || null,
        content: dto.content || undefined,
        categoryId: dto.categoryId || undefined,
      },
    });
  }

  async delete(ownerId: string, blogId: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) throw new NotFoundException('Blog not found');
    if (blog.userId !== ownerId)
      throw new ForbiddenException('Not authorized to delete this blog');

    return await this.prisma.blog.delete({ where: { id: blogId } });
  }
}
