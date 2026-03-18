import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common';
import { AccountResponseDto } from './dto/account.response.dto';
import { AccountRepository } from './account.repository';
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class AccountHelper {
  constructor(
      private prismaService: PrismaService,
  ) {}

  async check_account(id: number): Promise<AccountResponseDto> {
    const account = await this.prismaService.account.findUnique({
      where: {
        id: id,
      }
    });
    if (!account) {
      throw new InternalServerErrorException('Tài khoản không tồn tại');
    }
    return account;
  }

  async checkActive(id: number) {
    const account = await this.check_account(id);

    if (!account.isActive) {
      throw new BadRequestException('Tài khoản của bạn đã bị khóa');
    }

    return account;
  }

  async checkAdmin(id: number) {
    const account = await this.check_account(id);
    if(account.role === 'ADMIN'){
      throw new BadRequestException('Bạn không có quyền thao tác trên tài khoản ADMIN');
    }
    return account;
  }

  async checkSelfOrAdmin(tokenId: number, id: number, currentUserRole: string) {
    if (tokenId !== id && currentUserRole !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền thực hiện hành động này trên tài khoản của người khác');
    }
  }
}
