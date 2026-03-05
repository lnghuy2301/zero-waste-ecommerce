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
import { OrderService } from './order.service';
import { OrderRequestDto } from './dto/order.request.dto';
import { OrderResponseDto } from './dto/order.response.dto';
import { DeleteListOrderDto } from './dto/delete-list-order.dto';
import { JwtAuthGuard } from '../auth/auth.jwt.guard';
import { OrderStatus } from '@prisma/client';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Body() dto: OrderRequestDto): Promise<OrderResponseDto> {
    return this.orderService.createOrder(dto);
  }

  // ... phần còn lại giữ nguyên, chỉ sửa endpoint update status
  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  async updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { status: OrderStatus },
  ): Promise<OrderResponseDto> {
    return this.orderService.updateOrderStatus(id, dto.status);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:accountId')
  async getOrdersByUser(
    @Param('accountId', ParseIntPipe) accountId: number,
  ): Promise<OrderResponseDto[]> {
    return this.orderService.getOrdersByUser(accountId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOrderById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrderResponseDto | null> {
    return this.orderService.getOrderById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async cancelOrder(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrderResponseDto | null> {
    return this.orderService.cancelOrder(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteListOrders(
    @Body() dto: DeleteListOrderDto,
  ): Promise<{ count: number }> {
    return this.orderService.deleteListOrders(dto);
  }
}
