import { Injectable } from '@nestjs/common';
import { SignInUserDto } from './dto/sign-in-auth.dto';
import { SignUpUserDto } from './dto/sign-up-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { UserDto } from '../admin/user/dto/user.dto';
import { RoleType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  public static readonly saltRounds = 10;
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInUserDto: SignInUserDto): Promise<AuthDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: signInUserDto.email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!(await bcrypt.compare(signInUserDto.password, user.password))) {
      throw new Error('Invalid password');
    }

    const token = await this.jwtService.signAsync(user, {
      secret: process.env.JWT_SECRET,
    });

    return {
      token,
      user: new UserDto(user),
    };
  }

  async signUp(signUpUserDto: SignUpUserDto): Promise<AuthDto> {
    const user = await this.signInOrUp(signUpUserDto);
    if (!user) {
      throw new Error('User not found');
    }
    const token = await this.jwtService.signAsync(user, {
      secret: process.env.JWT_SECRET,
    });
    return {
      token,
      user: new UserDto(user),
    };
  }

  async signInOrUp(signUpUserDto: SignUpUserDto) {
    const { email, name, password, imageUrl } = signUpUserDto;

    const user = await this.prisma.user.findFirst({ where: { email } });
    if (user) {
      return user;
    }

    return this.prisma.$transaction(async (tx) => {
      const role = await tx.role.findFirst({
        where: {
          type: RoleType.OWNER,
          isDefault: true,
        },
      });

      if (!role) {
        throw new Error('Default owner role not found');
      }

      const hashedPassword = await bcrypt.hash(
        password,
        AuthService.saltRounds,
      );

      return tx.user.create({
        data: {
          name,
          email,
          imageUrl,
          password: hashedPassword,
          AccountUser: {
            create: {
              roleId: role.id,
            },
          },
        },
      });
    });
  }

  async getUserIfRefreshTokenMatches(email: string) {
    let user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: { email: email, name: email, password: '' },
      });
    }
    return { userId: email };
  }
}
