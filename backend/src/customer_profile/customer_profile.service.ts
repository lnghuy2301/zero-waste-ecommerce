import { Injectable } from '@nestjs/common';
import { CustomerProfileRepository } from './customer_profile.repository';
import { CustomerProfileHelper } from './customer_profile.helper';
import { CustomerProfileRequestDto } from './dto/customer_profile.request.dto';
import { CustomerProfileResponseDto } from './dto/customer_profile.response.dto';
import { AccountHelper } from '../account/account.helper';

@Injectable()
export class CustomerProfileService {
  constructor(
    private customerProfileRepository: CustomerProfileRepository,
    private customerProfileHelper: CustomerProfileHelper,
    private accountHelper: AccountHelper,
  ) {}

  async updateCustomerProfile(
    id: number,
    idAccount: number,
    customerProfileRequestDto: CustomerProfileRequestDto,
  ): Promise<CustomerProfileResponseDto> {
    await this.customerProfileHelper.check_profile_account(id, idAccount);
    return this.customerProfileRepository.updateCustomerProfile(
      id,
      customerProfileRequestDto,
    );
  }

  async getCustomerProfileById(
    id: number,
    idAccount: number,
  ): Promise<CustomerProfileResponseDto | null> {
    await this.customerProfileHelper.check_profile_account(id, idAccount);
    return this.customerProfileRepository.getCustomerProfileById(id);
  }

  async getAllCustomerProfile(): Promise<CustomerProfileResponseDto[]> {
    return this.customerProfileRepository.getAllCustomerProfiles();
  }
}
