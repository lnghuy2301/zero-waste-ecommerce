import {Body, Controller, Get, Post, Request, Res, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLocalGuard } from './auth.local.guard';
import { AccountRequestDto } from '../account/dto/account.request.dto';
import { AccountResponseDto } from '../account/dto/account.response.dto';
import {AuthGuard} from "@nestjs/passport";

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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Request() req) {
    // Guard tự động chuyển hướng sang trang đăng nhập của Google
  }

  // Google sẽ gọi lại API này sau khi user cấp quyền
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Request() req, @Res() res) {
    const result = await this.authService.validateGoogleUser(req.user);
    return res.redirect(`http://localhost:5173/login?token=${result.token}`);
  }
}
