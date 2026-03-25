import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CustomerProfileRepository } from './customer_profile.repository';
import { CustomerProfileHelper } from './customer_profile.helper';
import { CustomerProfileRequestDto } from './dto/customer_profile.request.dto';
import { CustomerProfileResponseDto } from './dto/customer_profile.response.dto';
import { AccountHelper } from '../account/account.helper';

@Injectable()
export class CustomerProfileService {
  constructor(
    private prismaService: PrismaService, // ← Thêm dòng này
    private customerProfileRepository: CustomerProfileRepository,
    private customerProfileHelper: CustomerProfileHelper,
    private accountHelper: AccountHelper,
  ) {}

  async updateCustomerProfile(
    id: number,
    accountId: number,
    customerProfileRequestDto: CustomerProfileRequestDto,
  ): Promise<CustomerProfileResponseDto> {
    await this.customerProfileHelper.check_profile_account(id, accountId);

    return this.customerProfileRepository.updateCustomerProfile(
      id,
      accountId,
      customerProfileRequestDto,
    );
  }

  async getCustomerProfileById(
    id: number,
  ): Promise<CustomerProfileResponseDto> {
    let profile =
      await this.customerProfileRepository.getCustomerProfileById(id);

    if (!profile) {
      // Tự động tạo profile mặc định nếu chưa có
      profile = await this.prismaService.customerProfile.create({
        data: {
          accountId: id,
          fullName: 'Người dùng mới',
          gender: 'Nam',
        },
      });
    }

    return profile;
  }

  async getAllCustomerProfile(): Promise<CustomerProfileResponseDto[]> {
    return this.customerProfileRepository.getAllCustomerProfiles();
  }
}
