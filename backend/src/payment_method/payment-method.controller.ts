import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodRequestDto } from './dto/payment-method.request.dto';
import { PaymentMethodResponseDto } from './dto/payment-method.response.dto';
import { DeleteListPaymentMethodDto } from './dto/delete-list-payment-method.dto';
import { JwtAuthGuard } from '../auth/auth.jwt.guard';
import { RolesGuard } from '../auth/auth.role.guard';
import { Roles } from '../auth/auth.role.decorator';
import { Role } from '@prisma/client';

@Controller('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(
    @Body() dto: PaymentMethodRequestDto,
  ): Promise<PaymentMethodResponseDto> {
    return this.paymentMethodService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PaymentMethodRequestDto,
  ): Promise<PaymentMethodResponseDto> {
    return this.paymentMethodService.update(id, dto);
  }

  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PaymentMethodResponseDto | null> {
    return this.paymentMethodService.getById(id);
  }

  @Get()
  async getAll(): Promise<PaymentMethodResponseDto[]> {
    return this.paymentMethodService.getAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PaymentMethodResponseDto | null> {
    return this.paymentMethodService.delete(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete()
  async deleteList(
    @Body() dto: DeleteListPaymentMethodDto,
  ): Promise<{ count: number }> {
    return this.paymentMethodService.deleteList(dto);
  }
}
