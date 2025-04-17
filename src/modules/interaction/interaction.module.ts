import { Module } from '@nestjs/common';
import { InteractionController } from './interaction.controller';
import { InteractionService } from './interaction.service';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '21600s' },
    }),
  ],
  controllers: [InteractionController],
  providers: [InteractionService],
})
export class InteractionModule {}
