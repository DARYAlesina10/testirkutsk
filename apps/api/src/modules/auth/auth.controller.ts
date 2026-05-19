import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { IsString } from 'class-validator';
import { AuthGuard } from '../common/auth.guard';

class LoginDto { @IsString() email!: string; @IsString() password!: string; }
class TgDto { @IsString() telegramId!: string; }

@Controller('auth')
export class AuthController {
  @Post('login') login(@Body() body: LoginDto) { return { token: 'mock-token', user: { email: body.email } }; }
  @Post('logout') logout() { return { ok: true }; }
  @Post('telegram') telegram(@Body() body: TgDto) { return { token: 'mock-telegram-token', telegramId: body.telegramId }; }
  @UseGuards(AuthGuard) @Get('me') me() { return { id: 'mock', role: 'USER' }; }
}
