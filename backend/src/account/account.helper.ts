import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AccountResponseDto } from './dto/account.response.dto';
import { AccountRepository } from './account.repository';

@Injectable()
export class AccountHelper {
  constructor(private accountRepository: AccountRepository) {}
  handleError(error: Error | any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    console.error('System error: ', error.message);
    throw new InternalServerErrorException('Server đang được bảo trì');
  }

  async check_account(id: number): Promise<AccountResponseDto> {
    const account = await this.accountRepository.getAccountById(id);
    if (!account) {
      throw new InternalServerErrorException('Tài khoản không tồn tại');
    }
    return account;
  }
}
