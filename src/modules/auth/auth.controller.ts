import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/sign-in-auth.dto';
import { SignUpUserDto } from './dto/sign-up-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthDto } from './dto/auth.dto';
import * as passport from 'passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

   @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const token = req.user?.token;
    const user = req.user?.user;
    if (!token) {
      return res.status(400).send('Token not found');
    }

    // Determine role from user data
    const roles = user?.Role?.type ? [user.Role.type] : [];

    let redirectUrl: string;
    if (roles.includes('OWNER')) {
      // Redirect OWNER to dashboard
      redirectUrl = `${process.env.OWNER_DASHBOARD_URL}?token=${token}`;
    } else {
      // Redirect normal user to blog page
      redirectUrl = `${process.env.WEB_CALLBACK_URL}/${encodeURIComponent}?token=${token}`;
    }

    return res.redirect(redirectUrl);
  }

  @Post('sign-in')
  async signIn(@Body() signInUserDto: SignInUserDto): Promise<AuthDto> {
    return await this.authService.signIn(signInUserDto);
  }

  @Post('sign-up')
  async signUp(@Body() signUpUserDto: SignUpUserDto): Promise<AuthDto> {
    const jerry = await this.authService.signUp(signUpUserDto);
    console.log('jerry', jerry);
    return jerry;
  }
}
