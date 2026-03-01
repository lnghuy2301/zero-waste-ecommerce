import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthLocalStrantegy } from './auth.local.strantegy';
import { JwtStrategy } from './auth.jwt.strantegy';
import { AuthController } from './auth.controller';
import { AccountService } from '../account/account.service';

@Module({
  imports: [
    AccountModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthLocalStrantegy, JwtStrategy],
  exports: [AuthService, AuthLocalStrantegy, JwtStrategy],
})
export class AuthModule {}
