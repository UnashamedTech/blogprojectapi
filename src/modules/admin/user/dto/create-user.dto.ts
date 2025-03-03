import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  roleId: string;
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
