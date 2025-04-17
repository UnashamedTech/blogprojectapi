import { Controller, Get, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Roles } from 'src/modules/auth/auth.decorator';
import { AuthGuard } from 'src/modules/auth/guard/auth/auth.guard';
import { RoleGuard } from 'src/modules/auth/guard/role/role.guard';

@Controller('categories')
@UseGuards(AuthGuard, RoleGuard)
@Roles('OWNER')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategories() {
    return this.categoryService.findAll();
  }
}
