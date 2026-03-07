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

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post() // public (register)
  async createAccount(
    @Body() account: AccountRequestDto,
  ): Promise<AccountResponseDto> {
    return this.accountService.createAccount(account);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/password')
  async updateAccount(
    @Body() resetPassword: ResetPasswordRequestDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.accountService.resetPassword(id, resetPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/active')
  async updateActive(
    @Param('id', ParseIntPipe) id: number,
    @Body() account: UpdateActiveRequestDto,
  ): Promise<AccountResponseDto> {
    return this.accountService.updateActive(id, account);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN) // chỉ admin sửa role
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

  @UseGuards(JwtAuthGuard)
  @Get(':id/status')
  async isActive(@Param('id', ParseIntPipe) id: number) {
    return this.accountService.checkActive(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getAccount(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AccountResponseDto | null> {
    return this.accountService.getAccountById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAllAccounts(): Promise<AccountResponseDto[]> {
    return this.accountService.getAllAccounts();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteAccountById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AccountResponseDto | null> {
    return this.accountService.deleteAccountById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete()
  async list_delete_account(@Body() listAccount: List_accountRequestDto) {
    return this.accountService.deleteListAccount(listAccount);
  }
}
