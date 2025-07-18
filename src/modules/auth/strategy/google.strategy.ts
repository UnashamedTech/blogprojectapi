import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;

    try {
      const user = await this.authService.signInOrUp({
        email: emails[0].value,
        name: name.givenName,
        password: emails[0].value,
        imageUrl: photos[0]?.value || null,
      });

      if (!user) {
        return done(new Error('User could not be authenticated'), false);
      }

      const userWithRoles = await this.authService.getUserWithRoles(user.id);

      const roles = [userWithRoles.Role.type]; // Use Role directly

      // Prepare JWT payload
      const payload = {
        sub: user.id,
        email: user.email,
        imageUrl: user.imageUrl,
        name: user.name,
        roles,
      };

      // Generate JWT token
      const token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRATION,
      });

      done(null, { token, user: userWithRoles });
    } catch (error) {
      done(error, false);
    }
  }
}
