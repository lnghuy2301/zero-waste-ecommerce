import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { AuthGuard } from '@nestjs/passport';
import { AuthLocalGuard } from './auth.local.guard';
import { AccountRequestDto } from '../account/dto/account.request.dto';
import { AccountResponseDto } from '../account/dto/account.response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthLocalGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(
    @Body() account: AccountRequestDto,
  ): Promise<AccountResponseDto> {
    return this.authService.register(account);
  }
}
