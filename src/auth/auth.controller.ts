import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { CsrfToken, Message } from './types/auth.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/csrf')
  getCsrfToken(@Req() req: Request): CsrfToken {
    return { csrfToken: req.csrfToken() };
  }

  @Post('signup')
  signUp(@Body() dto: AuthDto): Promise<Message> {
    return this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: AuthDto,
    // standardの無効化を防ぐ為
    @Res({ passthrough: true }) res: Response,
  ): Promise<Message> {
    const jwtToken = await this.authService.login(dto);
    res.cookie('access_token', jwtToken.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
    return {
      message: 'OK',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
    return {
      message: 'OK',
    };
  }
}
