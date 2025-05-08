import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './modules/admin/admin.module';
import { InteractionModule } from './modules/interaction/interaction.module';
import { CommentModule } from './modules/comment/comment.module';
import { BlogModule } from './modules/blog/blog.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    AdminModule,
    BlogModule,
    CommentModule,
    InteractionModule,
    ContactModule,
  ],
  providers: [PrismaService],
  controllers: [],
})
export class AppModule {}
