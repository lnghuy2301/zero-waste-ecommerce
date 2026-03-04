import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountRepository } from './account.repository';
import { AccountRequestDto } from './dto/account.request.dto';
import { AccountResponseDto } from './dto/account.response.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { ResetPasswordRequestDto } from './dto/reset_password.request.dto';
import { UpdateActiveRequestDto } from './dto/update_active.request.dto';
import { UpdateRoleRequesrDto } from './dto/update_role.request.dto';
import { List_accountRequestDto } from './dto/list_account.request.dto';
import { AccountHelper } from './account.helper';

@Injectable()
export class AccountService {
  constructor(
    private accountRepository: AccountRepository,
    private prismaService: PrismaService,
    private accountHelper: AccountHelper,
  ) {}

  async createAccount(account: AccountRequestDto): Promise<AccountResponseDto> {
    const check_email = await this.prismaService.account.findUnique({
      where: { email: account.email },
    });
    if (check_email) {
      throw new UnauthorizedException('Email đã tồn tại');
    }

    const saltRounds = 10;
    const hash_password = await bcrypt.hash(account.password, saltRounds);
    return await this.accountRepository.createAccount({
      ...account,
      password: hash_password,
    });
  }

  async resetPassword(id: number, resetPassword: ResetPasswordRequestDto) {
    const account = await this.accountHelper.check_account(id);
    const check_password = await bcrypt.compare(
      resetPassword.old_password,
      account.password,
    );
    if (!check_password) {
      throw new BadRequestException('Mật khẩu cũ sai');
    }

    if (resetPassword.new_password !== resetPassword.confirm_password) {
      throw new BadRequestException('Mật khẩu không trùng khớp');
    }
    const hash_password = await bcrypt.hash(resetPassword.confirm_password, 10);
    return this.accountRepository.updatePassword(id, hash_password);
  }

  async updateActive(
    id: number,
    updateisActive: UpdateActiveRequestDto,
  ): Promise<AccountResponseDto> {
    await this.accountHelper.check_account(id);
    return this.accountRepository.updateActive(id, updateisActive);
  }

  async updateRole(
    id: number,
    updateRole: UpdateRoleRequesrDto,
  ): Promise<AccountResponseDto> {
    await this.accountHelper.check_account(id);
    return this.accountRepository.updateRole(id, updateRole);
  }

  async statsAccount() {
    const result = await this.accountRepository.statsAccount();
    if (result === 0) {
      throw new BadRequestException('Không có tài khoản nào');
    }
    return result;
  }

  async checkActive(id: number) {
    const account = await this.accountHelper.check_account(id);
    if (!account.isActive) {
      throw new BadRequestException('Tài khoản của bạn đã bị khóa');
    }

    return account;
  }

  async getAccountById(id: number): Promise<AccountResponseDto | null> {
    const account = await this.accountRepository.getAccountById(id);
    if (!account) {
      throw new UnauthorizedException('Tài khoản không tồn tại');
    }
    return account;
  }

  async getAllAccounts(): Promise<AccountResponseDto[]> {
    const account = await this.accountRepository.getAllAccount();
    if (account.length == 0) {
      throw new BadRequestException('Không có tài khoản nào tồn tại');
    }
    return account;
  }

  async deleteAccountById(id: number): Promise<AccountResponseDto | null> {
    await this.accountHelper.check_account(id);
    return this.accountRepository.deleteAccountById(id);
  }

  async deleteListAccount(listAccount: List_accountRequestDto) {
    const account = await this.accountRepository.deleteListAccount(listAccount);
    if (!account) {
      throw new NotFoundException(
        'Không tìm thấy tài khoản nào hợp lệ để xóa hoặc danh sách chứa Admin',
      );
    }
    return account;
  }
}
