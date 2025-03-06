import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class InteractionService {
  constructor(private prisma: PrismaService) {}
  async likeBlog(userId: string, blogId: string) {
    return this.prisma.like.upsert({
      where: { userId_blogId: { userId, blogId } },
      update: {},
      create: {
        userId,
        blogId,
      },
    });
  }
  async likeComment(userId: string, commentId: string) {
    return this.prisma.like.upsert({
      where: { userId_commentId: { userId, commentId } },
      update: {},
      create: {
        userId,
        commentId,
      },
    });
  }
}
