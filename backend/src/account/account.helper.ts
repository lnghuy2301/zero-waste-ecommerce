import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AccountResponseDto } from './dto/account.response.dto';
import { AccountRepository } from './account.repository';

@Injectable()
export class AccountHelper {
  constructor(private accountRepository: AccountRepository) {}

  async check_account(id: number): Promise<AccountResponseDto> {
    const account = await this.accountRepository.getAccountById(id);
    if (!account) {
      throw new InternalServerErrorException('Tài khoản không tồn tại');
    }
    return account;
  }
}
