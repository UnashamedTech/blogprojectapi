import { Controller, Get, UseGuards, Post,
Patch,
Delete,
Param,
Body, ParseUUIDPipe,} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Roles } from 'src/modules/auth/auth.decorator';
import { AuthGuard } from 'src/modules/auth/guard/auth/auth.guard';
import { RoleGuard } from 'src/modules/auth/guard/role/role.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@UseGuards(AuthGuard, RoleGuard)
@Roles('OWNER')
export class CategoryController {
constructor(private readonly categoryService: CategoryService) {}

@Get()
async getAllCategories() {
return this.categoryService.findAll();
}

@Post()
async createCategory(@Body() dto: CreateCategoryDto) {
return this.categoryService.create(dto);
}

@Patch(':id')
async updateCategory(@Param('id', new ParseUUIDPipe()) id: string,
@Body() dto: UpdateCategoryDto,
) {
return this.categoryService.update(id, dto);
}

@Delete(':id')
async removeCategory(@Param('id', new ParseUUIDPipe()) id: string) {
return this.categoryService.remove(id);
}
}