import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountRequestDto } from './dto/account.request.dto';
import { AccountResponseDto } from './dto/account.response.dto';
import { ResetPasswordRequestDto } from './dto/reset_password.request.dto';
import { UpdateActiveRequestDto } from './dto/update_active.request.dto';
import { UpdateRoleRequesrDto } from './dto/update_role.request.dto';
import { List_accountRequestDto } from './dto/list_account.request.dto';
import { JwtAuthGuard } from '../auth/auth.jwt.guard';
import { RolesGuard } from '../auth/auth.role.guard';
import { Roles } from '../auth/auth.role.decorator';
import { Role } from '@prisma/client';
import { GetUser } from '../auth/get-user.decorator';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post() // Public (Đăng ký)
  async createAccount(
    @Body() account: AccountRequestDto,
  ): Promise<AccountResponseDto> {
    return this.accountService.createAccount(account);
  }

  // Chỉnh sửa: Đổi mật khẩu (Cần chính chủ hoặc Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CUSTOMER)
  @Put(':id/password')
  async updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() resetPassword: ResetPasswordRequestDto,
    @GetUser() currentUser: any, // Lấy user từ Token
  ) {
    return this.accountService.resetPassword(id, resetPassword, currentUser);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id/active')
  async updateActive(
    @Param('id', ParseIntPipe) id: number,
    @Body() account: UpdateActiveRequestDto,
  ): Promise<AccountResponseDto> {
    return this.accountService.updateActive(id, account);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id/role')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() account: UpdateRoleRequesrDto,
  ): Promise<AccountResponseDto> {
    return this.accountService.updateRole(id, account);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('stats/count')
  async statsAccount() {
    return this.accountService.statsAccount();
  }

  // Chỉnh sửa: Xem tài khoản (Chỉ xem chính mình hoặc Admin xem hết)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CUSTOMER)
  @Get(':id')
  async getAccount(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() currentUser: any,
  ): Promise<AccountResponseDto | null> {
    return this.accountService.getAccountById(id, currentUser);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAllAccounts(
    @GetUser() currentUser: any,
  ): Promise<AccountResponseDto[]> {
    return this.accountService.getAllAccounts(currentUser);
  }

  // Chỉnh sửa: Xóa tài khoản (Chỉ mình xóa mình hoặc Admin xóa người khác)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CUSTOMER)
  @Delete(':id')
  async deleteAccountById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() currentUser: any,
  ): Promise<AccountResponseDto | null> {
    return this.accountService.deleteAccountById(id, currentUser);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete()
  async list_delete_account(@Body() listAccount: List_accountRequestDto) {
    return this.accountService.deleteListAccount(listAccount);
  }
}
