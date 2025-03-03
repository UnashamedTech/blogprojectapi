import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { RefreshStrategy } from './strategy/refresh.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthGuard } from './guard/auth/auth.guard';
import { GoogleLocalStrategy } from './strategy/local.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    GoogleLocalStrategy,
    RefreshStrategy,
    PrismaService,
    JwtService,
    AuthGuard,
  ],
  exports: [PassportModule],
})
export class AuthModule {}
