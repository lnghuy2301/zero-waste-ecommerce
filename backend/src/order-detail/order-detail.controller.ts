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
import { OrderDetailService } from './order-detail.service';
import { OrderDetailRequestDto } from './dto/order-detail.request.dto';
import { OrderDetailResponseDto } from './dto/order-detail.response.dto';
import { DeleteListOrderDetailDto } from './dto/delete-list-order-detail.dto';
import { JwtAuthGuard } from '../auth/auth.jwt.guard';

@Controller('order-detail')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrderDetail(
    @Body() dto: OrderDetailRequestDto,
  ): Promise<OrderDetailResponseDto> {
    return this.orderDetailService.createOrderDetail(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateOrderDetail(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: OrderDetailRequestDto,
  ): Promise<OrderDetailResponseDto> {
    return this.orderDetailService.updateOrderDetail(id, dto);
  }

  @Get(':id')
  async getOrderDetailById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrderDetailResponseDto | null> {
    return this.orderDetailService.getOrderDetailById(id);
  }

  @Get('order/:orderId')
  async getOrderDetailsByOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<OrderDetailResponseDto[]> {
    return this.orderDetailService.getOrderDetailsByOrder(orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOrderDetail(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrderDetailResponseDto | null> {
    return this.orderDetailService.deleteOrderDetail(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteListOrderDetails(
    @Body() dto: DeleteListOrderDetailDto,
  ): Promise<{ count: number }> {
    return this.orderDetailService.deleteListOrderDetails(dto);
  }
}
