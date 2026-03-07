import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AccountRequestDto } from './dto/account.request.dto';
import { AccountResponseDto } from './dto/account.response.dto';
import { Account_profileResponseDto } from './dto/account_profile.response.dto';
import { List_accountRequestDto } from './dto/list_account.request.dto';
import { UpdateActiveRequestDto } from './dto/update_active.request.dto';
import { UpdateRoleRequesrDto } from './dto/update_role.request.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AccountRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createAccount(
    account: AccountRequestDto,
  ): Promise<Account_profileResponseDto> {
    const newAccount = await this.prismaService.account.create({
      data: {
        email: account.email,
        password: account.password,
        role: account.role,
        isActive: account.isActive,
        profile: {
          create: {
            fullName: account.profile.fullName,
            phone: account.profile.phone,
            address: account.profile.address,
            gender: account.profile.gender,
            dob: account.profile.dob,
          },
        },
      },
      include: { profile: true },
    });
    return plainToInstance(Account_profileResponseDto, newAccount);
  }

  async updatePassword(
    id: number,
    hashPassword: string,
  ): Promise<AccountResponseDto> {
    const updated = await this.prismaService.account.update({
      where: {
        id: id,
        role: {
          not: 'ADMIN',
        },
      },
      data: {
        password: hashPassword,
      },
    });
    return plainToInstance(AccountResponseDto, updated);
  }

  async updateActive(
    id: number,
    account: UpdateActiveRequestDto,
  ): Promise<AccountResponseDto> {
    const updated = await this.prismaService.account.update({
      where: {
        id: id,
        role: {
          not: 'ADMIN',
        },
      },
      data: {
        isActive: account.isActive,
      },
    });
    return plainToInstance(AccountResponseDto, updated);
  }

  async updateRole(
    id: number,
    account: UpdateRoleRequesrDto,
  ): Promise<AccountResponseDto> {
    const updated = await this.prismaService.account.update({
      where: {
        id: id,
        role: {
          not: 'ADMIN',
        },
      },
      data: {
        role: account.role,
      },
    });
    return plainToInstance(AccountResponseDto, updated);
  }

  async statsAccount() {
    return this.prismaService.account.count({
      where: {
        role: {
          not: 'ADMIN',
        },
      },
    });
  }

  async getAccountById(id: number): Promise<AccountResponseDto | null> {
    const account = await this.prismaService.account.findUnique({
      where: {
        id: id,
        role: {
          not: 'ADMIN',
        },
      },
    });
    return account ? plainToInstance(AccountResponseDto, account) : null;
  }

  async getAllAccount(): Promise<AccountResponseDto[]> {
    const accounts = await this.prismaService.account.findMany({
      where: {
        role: {
          not: 'ADMIN',
        },
      },
    });
    return accounts.map((a) => plainToInstance(AccountResponseDto, a));
  }

  async deleteAccountById(id: number) {
    return this.prismaService.$transaction(async (tx) => {
      const account = await this.getAccountById(id);
      if (!account) return null;
      await tx.customerProfile.deleteMany({
        where: {
          accountId: account.id,
        },
      });

      await tx.account.delete({
        where: {
          id: id,
        },
      });

      return account;
    });
  }

  async deleteListAccount(listAccount: List_accountRequestDto) {
    return this.prismaService.$transaction(async (tx) => {
      const accounts = await tx.account.findMany({
        where: {
          id: {
            in: listAccount.Ids,
          },
          role: {
            not: 'ADMIN',
          },
        },
        select: { id: true },
      });

      if (accounts.length === 0) return null;

      await tx.customerProfile.deleteMany({
        where: {
          accountId: {
            in: listAccount.Ids,
          },
        },
      });

      await tx.account.deleteMany({
        where: {
          id: {
            in: listAccount.Ids,
          },
        },
      });

      return { count: accounts.length };
    });
  }
}
