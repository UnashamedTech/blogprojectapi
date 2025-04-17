import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { BlogModule } from './blog/blog.module';
import { InteractionModule } from './interaction/interaction/interaction.module';
import { CommentModule } from './comment/comment/comment.module';
import { CategoryModule } from './category/category.module';
import { InformationModule } from './information/information.module';

@Module({
  imports: [
    UserModule,
    BlogModule,
    InteractionModule,
    CommentModule,
    CategoryModule,
    InformationModule,
  ],
})
export class AdminModule {}
