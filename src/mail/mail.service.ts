import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class MailService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async sendContactEmail(fullName: string, email: string, message: string) {
    // 1. Retrieve the contact address from DB
    const info = await this.prisma.information.findFirst();
    if (!info) {
      throw new InternalServerErrorException('Contact email not configured');
    }
    const toEmail = info.contactEmail;

    // 2. Create SMTP transport using environment variables
    const transporter = nodemailer.createTransport({
      host: this.config.get<string>('MAIL_HOST'),
      port: this.config.get<number>('MAIL_PORT'),
      secure: false, // or true if using 465
      auth: {
        user: this.config.get<string>('MAIL_USER'),
        pass: this.config.get<string>('MAIL_PASS'),
      },
    });
    // (Optional) Verify connection (can help debug in dev)
    // await transporter.verify();

    // 3. Compose the email
    const mailOptions = {
      from: this.config.get<string>('MAIL_FROM'),
      to: toEmail,
      subject: `Contact Form: ${fullName} wrote`,
      text:
        `You have received a new message from the contact form:\n\n` +
        `Name: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    // 4. Send the email
    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      // Log or handle error as needed
      console.error('Failed to send email:', err);
      throw new InternalServerErrorException('Could not send email');
    }
  }
  async sendInvitationEmail(toEmail: string, subject: string, message: string) {
    const transporter = nodemailer.createTransport({
      host: this.config.get<string>('MAIL_HOST'),
      port: this.config.get<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.config.get<string>('MAIL_USER'),
        pass: this.config.get<string>('MAIL_PASS'),
      },
    });

    const mailOptions = {
      from: this.config.get<string>('MAIL_FROM'),
      to: toEmail,
      subject,
      text: message,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error('Failed to send invitation email:', err);
      throw new InternalServerErrorException('Could not send invitation email');
    }
  }
}
