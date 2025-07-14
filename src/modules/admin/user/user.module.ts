import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { MailModule } from 'src/mail/mail.module';
@Module({
  imports: [PrismaModule, AuthModule, JwtModule, MailModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, MailService],
  exports: [UserService],
})
export class UserModule {}
