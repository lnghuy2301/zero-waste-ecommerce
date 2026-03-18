import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthLocalStrantegy } from './auth.local.strantegy';
import { JwtStrategy } from './auth.jwt.strantegy';
import { AuthController } from './auth.controller';
import {GoogleStrategy} from "./google.strantegy";
// import { AccountService } from '../account/account.service';

@Module({
  imports: [
    AccountModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || '6f8d1c2a3b4e5f67890abcdef1234567890abcdef1234567890abcdef12345678',
      signOptions: { expiresIn: '1h' }, // Tui sửa lại nhe đang test cái hết thời gian phải login lại ;)
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthLocalStrantegy, JwtStrategy, GoogleStrategy],
  exports: [AuthService, AuthLocalStrantegy, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
