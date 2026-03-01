import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CustomerProfileRequestDto } from './dto/customer_profile.request.dto';
import { CustomerProfileResponseDto } from './dto/customer_profile.response.dto';
import { CustomerProfileService } from './customer_profile.service';
import { JwtAuthGuard } from '../auth/auth.jwt.guard';

@Controller('customer_profile')
export class CustomerProfileController {
  constructor(private customerProfileService: CustomerProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Put(':id/profile/:idAccount')
  async updateCustomerProfile(
    @Param('id', ParseIntPipe) id: number,
    @Param('idAccount', ParseIntPipe) idAccount: number,
    @Body() customerProfileRequestDto: CustomerProfileRequestDto,
  ): Promise<CustomerProfileResponseDto> {
    return await this.customerProfileService.updateCustomerProfile(
      id,
      idAccount,
      customerProfileRequestDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/profile/:idAccount')
  async getCustomerProfileById(
    @Param('id', ParseIntPipe) id: number,
    @Param('idAccount', ParseIntPipe) idAccount: number,
  ): Promise<CustomerProfileResponseDto | null> {
    return await this.customerProfileService.getCustomerProfileById(
      id,
      idAccount,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllCustomerProfiles(): Promise<CustomerProfileResponseDto[]> {
    return await this.customerProfileService.getAllCustomerProfile();
  }
}
