import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { AuthGuard } from 'src/modules/auth/guard/auth/auth.guard';
import { Roles } from 'src/modules/auth/auth.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RoleGuard } from 'src/modules/auth/guard/role/role.guard';

@Controller('user/blog')
@UseGuards(AuthGuard, RoleGuard)
@Roles('USER')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.blogService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }
}
