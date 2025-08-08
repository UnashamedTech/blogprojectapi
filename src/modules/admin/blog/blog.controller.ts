import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { Request } from 'express';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from 'src/modules/auth/guard/auth/auth.guard';
import { Roles } from 'src/modules/auth/auth.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RoleGuard } from 'src/modules/auth/guard/role/role.guard';
import { BLOG_LAYOUTS, LAYOUT_DESCRIPTIONS } from 'src/common/constants/layout.constants';

@Controller('admin/blog')
@UseGuards(AuthGuard, RoleGuard)
@Roles('OWNER')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateBlogDto) {
    return this.blogService.create(req.user['id'], dto);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('isDraft') isDraft?: string,
  ) {
    const draftFlag =
      isDraft === 'true' ? true : isDraft === 'false' ? false : undefined;
    return this.blogService.findAll(paginationDto, draftFlag);
  }

  @Get('layouts')
  getLayouts(
    @Query(new ValidationPipe({ transform: true }))
    paginationDto: PaginationDto,
  ) {
    const { page = 1, limit = 10 } = paginationDto;
    const allLayouts = Object.entries(BLOG_LAYOUTS).map(([key, value]) => ({
      key,
      value,
      description: LAYOUT_DESCRIPTIONS[value],
    }));
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const layouts = allLayouts.slice(startIndex, endIndex);
    const total = allLayouts.length;
    const totalPages = Math.ceil(total / limit);

    return {
      data: layouts,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateBlogDto,
  ) {
    return this.blogService.update(req.user['id'], id, dto);
  }

  @Delete(':id')
  delete(@Req() req: Request, @Param('id') id: string) {
    return this.blogService.delete(req.user['id'], id);
  }
}
