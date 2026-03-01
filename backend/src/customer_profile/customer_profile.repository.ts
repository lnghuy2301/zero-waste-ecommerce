import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CustomerProfileRequestDto } from './dto/customer_profile.request.dto';
import { CustomerProfileResponseDto } from './dto/customer_profile.response.dto';
// import { AccountRepository } from '../account/account.repository';

@Injectable()
export class CustomerProfileRepository {
  constructor(private prismaService: PrismaService) {}

  async updateCustomerProfile(
    id: number,
    customerProfileRequestDto: CustomerProfileRequestDto,
  ): Promise<CustomerProfileResponseDto> {
    return this.prismaService.customerProfile.update({
      where: {
        id: id,
      },
      data: {
        fullName: customerProfileRequestDto.fullName,
        phone: customerProfileRequestDto.phone,
        address: customerProfileRequestDto.address,
        gender: customerProfileRequestDto.gender,
        dob: customerProfileRequestDto.dob,
      },
    });
  }

  async getCustomerProfileById(
    id: number,
  ): Promise<CustomerProfileResponseDto | null> {
    return this.prismaService.customerProfile.findUnique({ where: { id: id } });
  }

  async getAllCustomerProfiles(): Promise<CustomerProfileResponseDto[]> {
    return this.prismaService.customerProfile.findMany();
  }
}
