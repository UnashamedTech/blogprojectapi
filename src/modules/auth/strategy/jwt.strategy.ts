import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { id: string; email: string; roles: string[] }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
      include: { RoleUser: { include: { Role: true } } },
    });

    if (!user) {
      return null;
    }

    return {
      userId: user.id,
      email: user.email,
      roles: user.RoleUser.map((ru) => ru.Role.type), // Ensure roles are returned
    };
  }
}
