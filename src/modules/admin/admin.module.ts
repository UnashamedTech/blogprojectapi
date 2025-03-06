import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { BlogModule } from './blog/blog.module';
import { InteractionModule } from './interaction/interaction/interaction.module';
import { CommentModule } from './comment/comment/comment.module';

@Module({
  imports: [UserModule, BlogModule, InteractionModule, CommentModule],
})
export class AdminModule {}
