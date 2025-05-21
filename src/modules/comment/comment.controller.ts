import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guard/auth/auth.guard';
import { RoleGuard } from 'src/modules/auth/guard/role/role.guard';
import { Roles } from 'src/modules/auth/auth.decorator';
import { CommentService } from 'src/modules/comment/comment.service';

@Controller('comments')
@UseGuards(AuthGuard, RoleGuard)
@Roles('USER')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Post('blog/:blogId')
  createComment(
    @Param('blogId') blogId: string,
    @Body('content') content: string,
    @Req() req,
  ) {
    return this.commentService.createComment(req.user.sub, blogId, content);
  }

  @Post('reply/:commentId')
  replyToComment(
    @Param('commentId') commentId: string,
    @Body('content') content: string,
    @Req() req,
  ) {
    return this.commentService.replyToComment(req.user.sub, commentId, content);
  }
  @Get('blog/:blogId')
  getComments(@Param('blogId') blogId: string) {
    return this.commentService.getCommentsByBlogId(blogId);
  }

  @Patch(':commentId')
  updateComment(
    @Param('commentId') commentId: string,
    @Body('content') content: string,
  ) {
    return this.commentService.updateComment(commentId, content);
  }

  @Delete(':commentId')
  deleteComment(@Param('commentId') commentId: string) {
    return this.commentService.deleteComment(commentId);
  }
}
