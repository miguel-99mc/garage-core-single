import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { setCookie } from './config/cookie.utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: any, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);

    setCookie(res, 'access_token', result.access_token, {
      maxAge: 1000 * 60 * 60 * 24,
    });

    return result;
  }
}
