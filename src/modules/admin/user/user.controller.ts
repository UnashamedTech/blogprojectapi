import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/modules/auth/guard/auth/auth.guard';
import { Roles } from 'src/modules/auth/auth.decorator';
import { UserService } from './user.service';

@Controller('admin/user')
@UseGuards(AuthGuard)
@Roles('OWNER')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  async findAll() {
    return this.userService.findAllUsers();
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
