import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
@Injectable()
export class CategoryService {
constructor(private prisma: PrismaService) {}

async findAll(paginationDto: PaginationDto) {
  const { page = 1, limit = 10 } = paginationDto;
  const take = limit;
  const skip = (page - 1) * limit;
  
  const [data, total] = await this.prisma.$transaction([
    this.prisma.category.findMany({
      take,
      skip,
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    }),
    this.prisma.category.count({
      where: { deletedAt: null },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}

async create(dto: CreateCategoryDto) {
return this.prisma.category.create({ data: dto });
}

async update(id: string, dto: UpdateCategoryDto) {
const existing = await this.prisma.category.findUnique({ where: { id } });
if (!existing || existing.deletedAt) {
throw new NotFoundException(`Category with id ${id} not found`);
}
return this.prisma.category.update({
where: { id },
data: { ...dto, updatedAt: new Date() },
});
}

async remove(id: string) {
const existing = await this.prisma.category.findUnique({ where: { id } });
if (!existing || existing.deletedAt) {
throw new NotFoundException(`Category with id ${id} not found`);
}
return this.prisma.category.update({
where: { id },data: { deletedAt: new Date() },
});
}
}