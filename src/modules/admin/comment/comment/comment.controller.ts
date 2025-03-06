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
import { CommentService } from './comment.service';
import { Roles } from 'src/modules/auth/auth.decorator';
import { AuthGuard } from 'src/modules/auth/guard/auth/auth.guard';

@Controller('comment')
@UseGuards(AuthGuard)
@Roles('OWNER')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Post('blog/:blogId')
  createComment(
    @Param('blogId') blogId: string,
    @Body('content') content: string,
    @Req() req,
  ) {
    return this.commentService.createComment(req.user.id, blogId, content);
  }

  @Post('reply/:commentId')
  replyToComment(
    @Param('commentId') commentId: string,
    @Body('content') content: string,
    @Req() req,
  ) {
    return this.commentService.replyToComment(req.user.id, commentId, content);
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
