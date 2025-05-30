import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  ValidationPipe,
  Post,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/modules/auth/guard/auth/auth.guard';
import { Roles } from 'src/modules/auth/auth.decorator';
import { UserService } from './user.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RoleGuard } from 'src/modules/auth/guard/role/role.guard';

@Controller('admin/user')
@UseGuards(AuthGuard, RoleGuard)
@Roles('OWNER')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('invite')
  async inviteUser(@Body() body: { name: string; email: string }) {
    return this.userService.inviteUserByEmail(body.name, body.email);
  }

  @Get('all')
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    paginationDto: PaginationDto,
  ) {
    return this.userService.findAllUsers(paginationDto);
  }

  @Get('user/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch('user/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete('user/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
