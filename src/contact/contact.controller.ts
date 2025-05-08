import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { ContactDto } from './contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private mailService: MailService) {}

  @Post()
  async submitContact(@Body() body: ContactDto) {
    const { fullName, email, message } = body;
    try {
      await this.mailService.sendContactEmail(fullName, email, message);
      return { message: 'Contact form submitted successfully' };
    } catch (err) {
      // Handle errors (e.g., log and rethrow as HTTP error)
      console.error('Error sending contact email:', err);
      throw new HttpException(
        'Failed to send contact message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
