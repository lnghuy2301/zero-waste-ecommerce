import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { OrderHelper } from './order.helper';
import { OrderRequestDto } from './dto/order.request.dto';
import { OrderResponseDto } from './dto/order.response.dto';
import { DeleteListOrderDto } from './dto/delete-list-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private orderHelper: OrderHelper,
  ) {}

  async createOrder(dto: OrderRequestDto): Promise<OrderResponseDto> {
    return this.orderRepository.createOrder(dto);
  }

  async updateOrderStatus(
    id: number,
    status: OrderStatus,
  ): Promise<OrderResponseDto> {
    await this.orderHelper.checkOrder(id);
    return this.orderRepository.updateOrderStatus(id, status);
  }

  async getOrdersByUser(accountId: number): Promise<OrderResponseDto[]> {
    return this.orderRepository.getOrdersByUser(accountId);
  }

  async getOrderById(id: number): Promise<OrderResponseDto | null> {
    const order = await this.orderRepository.getOrderById(id);
    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }
    return order;
  }

  async cancelOrder(id: number): Promise<OrderResponseDto | null> {
    await this.orderHelper.checkOrder(id);
    return this.orderRepository.cancelOrder(id);
  }

  async deleteListOrders(dto: DeleteListOrderDto): Promise<{ count: number }> {
    const result = await this.orderRepository.deleteListOrders(dto);
    if (result.count === 0) {
      throw new NotFoundException('Không tìm thấy đơn hàng nào để xóa');
    }
    return result;
  }
}
