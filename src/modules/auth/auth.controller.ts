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
  const jwt = req.user.token;       // <-- grab the string
  res.redirect(`${process.env.WEB_CALLBACK_URL}?token=${jwt}`);
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
