import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { ContactController } from './contact.controller';
import { MailService } from 'src/mail/mail.service';
import { MailModule } from 'src/mail/mail.module';
@Module({
  imports: [ConfigModule, PrismaModule, MailModule],
  controllers: [ContactController],
  providers: [MailService],
})
export class ContactModule {}
