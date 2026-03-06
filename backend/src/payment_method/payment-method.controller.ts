import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodRequestDto } from './dto/payment-method.request.dto';
import { PaymentMethodResponseDto } from './dto/payment-method.response.dto';
import { DeleteListPaymentMethodDto } from './dto/delete-list-payment-method.dto';

@Controller('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Post()
  async create(
    @Body() dto: PaymentMethodRequestDto,
  ): Promise<PaymentMethodResponseDto> {
    return this.paymentMethodService.create(dto);
  }

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

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PaymentMethodResponseDto | null> {
    return this.paymentMethodService.delete(id);
  }

  @Delete()
  async deleteList(
    @Body() dto: DeleteListPaymentMethodDto,
  ): Promise<{ count: number }> {
    return this.paymentMethodService.deleteList(dto);
  }
}
