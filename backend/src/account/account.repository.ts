import {
  //   BadRequestException,
  Injectable,
  //   UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AccountRequestDto } from './dto/account.request.dto';
import { AccountResponseDto } from './dto/account.response.dto';
import { plainToInstance } from 'class-transformer';
// import { ResetPasswordRequestDto } from './dto/reset_password.request.dto';
import { Account_profileResponseDto } from './dto/account_profile.response.dto';
import { List_accountRequestDto } from './dto/list_account.request.dto';
import { UpdateActiveRequestDto } from './dto/update_active.request.dto';
import { UpdateRoleRequesrDto } from './dto/update_role.request.dto';

@Injectable()
export class AccountRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createAccount(account: AccountRequestDto,): Promise<Account_profileResponseDto> {
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

  async updatePassword(id: number, hashPassword: string): Promise<AccountResponseDto> {
    return this.prismaService.account.update({
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
  }

  async updateActive(
    id: number,
    account: UpdateActiveRequestDto,
  ): Promise<AccountResponseDto> {
    return this.prismaService.account.update({
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
  }

  async updateRole(
    id: number,
    account: UpdateRoleRequesrDto,
  ): Promise<AccountResponseDto> {
    return this.prismaService.account.update({
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
    return this.prismaService.account.findUnique({
      where: {
        id: id,
        role: {
          not: 'ADMIN',
        },
      },
    });
  }

  async getAllAccount(): Promise<AccountResponseDto[]> {
    return this.prismaService.account.findMany({
      where: {
        role: {
          not: 'ADMIN',
        },
      },
    });
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
      const account = await tx.account.findMany({
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

      if (account.length === 0) return null;

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
    });
  }
}
