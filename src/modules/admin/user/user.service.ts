import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async inviteUserByEmail(name: string, email: string) {
    const inviteLink = `https://blogprojectfrontend2.vercel.app`; // Customize the link
    const subject = 'You are invited to read our latest blog!';
    const message = `
      Hi ${name},

      You've been invited to read a new blog post from our platform.

      Click the link below to view it:
      ${inviteLink}

      If you have any questions, feel free to reply to this email.

      Best regards,
      The Blog Team
    `;

    await this.mailService.sendInvitationEmail(email, subject, message);
    return { message: `Invitation sent to ${email}` };
  }

  async findAllUsers(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const take = limit;
    const skip = (page - 1) * limit;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        take,
        skip,
        include: {
          Role: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        Role: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prisma.comment.deleteMany({ where: { userId: id } });

    await this.prisma.like.deleteMany({ where: { userId: id } });

    await this.prisma.blog.deleteMany({ where: { userId: id } });

    return this.prisma.user.delete({ where: { id } });
  }
}
