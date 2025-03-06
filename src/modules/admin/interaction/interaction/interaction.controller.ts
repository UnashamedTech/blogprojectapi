import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { Roles } from 'src/modules/auth/auth.decorator';
import { AuthGuard } from 'src/modules/auth/guard/auth/auth.guard';

@Controller('interaction')
@UseGuards(AuthGuard)
@Roles('OWNER')
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}
  @Post('blog/:blogId')
  likeBlog(@Param('blogId') blogId: string, @Req() req) {
    return this.interactionService.likeBlog(req.user.id, blogId);
  }

  @Post('comment/:commentId')
  likeComment(@Param('commentId') commentId: string, @Req() req) {
    return this.interactionService.likeComment(req.user.id, commentId);
  }
}
