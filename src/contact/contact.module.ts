import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { ContactController } from './contact.controller';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [ContactController],
  providers: [MailService],
})
export class ContactModule {}
