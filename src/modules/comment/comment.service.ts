import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}
  async createComment(userId: string, blogId: string, content: string) {
    return this.prisma.comment.create({
      data: {
        content,
        blogId,
        userId,
      },
    });
  }
  async replyToComment(userId: string, parentId: string, content: string) {
    const parentComment = await this.prisma.comment.findUnique({
      where: { id: parentId },
    });
    if (!parentComment) throw new NotFoundException('Parent comment not found');

    return this.prisma.comment.create({
      data: {
        content,
        blogId: parentComment.blogId,
        userId,
        parentId,
      },
    });
  }
  async getCommentsByBlogId(blogId: string) {
    return this.prisma.comment.findMany({
      where: { blogId },
      include: {
        replies: true,
      },
    });
  }
  async updateComment(commentId: string, content: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) throw new NotFoundException('Comment not found');

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });
  }

  async deleteComment(commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        replies: true,
      },
    });
    if (!comment) throw new NotFoundException('Comment not found');

    await this.prisma.comment.deleteMany({
      where: { parentId: commentId },
    });

    return this.prisma.comment.delete({
      where: { id: commentId },
    });
  }
}
