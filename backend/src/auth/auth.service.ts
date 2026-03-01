import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CustomerProfileResponseDto } from '../customer_profile/dto/customer_profile.response.dto';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthLoginDto } from './dto/auth.login.dto';
import { AccountResponseDto } from '../account/dto/account.response.dto';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from '../account/account.service';
import { AccountRequestDto } from '../account/dto/account.request.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private accountService: AccountService,
  ) {}

  async validate(authLoginDto: AuthLoginDto): Promise<AccountResponseDto> {
    const user = await this.prismaService.account.findUnique({
      where: { email: authLoginDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại');
    }
    const pass = await bcrypt.compare(authLoginDto.password, user.password);
    if (!pass) {
      throw new BadRequestException('Mật khẩu không chính xác');
    }
    const { password, ...result } = user;
    return user;
  }

  async register(account: AccountRequestDto): Promise<AccountResponseDto> {
    return await this.accountService.createAccount(account);
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };
    return {
      token: this.jwtService.sign(payload),
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      isActive: payload.isActive,
    };
  }
}
