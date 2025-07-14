// src/modules/mail/mail.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { MailService } from './mail.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
