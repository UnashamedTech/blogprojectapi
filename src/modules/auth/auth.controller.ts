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
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/sign-in-auth.dto';
import { SignUpUserDto } from './dto/sign-up-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthDto } from './dto/auth.dto';
import * as passport from 'passport';
import { GoogleAuthGuard } from './guard/auth/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

   @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Req()  req: Request & { user: { token: string; user: any } },
    @Res()  res: Response
  ) {
    const { token, user } = req.user;
    // 1) see if client asked for a special “from” in state
    const from = (req.query.state as string) || null;

    // 2) fallback to role‐based defaults
    const roleType = user.Role?.type ?? 'USER';
    const defaultTarget =
      roleType === 'OWNER'
        ? process.env.OWNER_DASHBOARD_URL
        : process.env.WEB_CALLBACK_URL;

    const finalUrl = from ? from : defaultTarget;

    // 3) do the final redirect
    return res.redirect(
      `${finalUrl}?token=${encodeURIComponent(token)}`
    );
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
