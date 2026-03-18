import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderDetailRepository } from './order-detail.repository';
import { OrderDetailHelper } from './order-detail.helper';
import { OrderDetailRequestDto } from './dto/order-detail.request.dto';
import { OrderDetailResponseDto } from './dto/order-detail.response.dto';
import { DeleteListOrderDetailDto } from './dto/delete-list-order-detail.dto';

@Injectable()
export class OrderDetailService {
  constructor(
    private orderDetailRepository: OrderDetailRepository,
    private orderDetailHelper: OrderDetailHelper,
  ) {}

  async createOrderDetail(
    dto: OrderDetailRequestDto,
  ): Promise<OrderDetailResponseDto> {
    return this.orderDetailRepository.createOrderDetail(dto);
  }

  async updateOrderDetail(
    id: number,
    dto: OrderDetailRequestDto,
  ): Promise<OrderDetailResponseDto> {
    await this.orderDetailHelper.checkOrderDetail(id);
    return this.orderDetailRepository.updateOrderDetail(id, dto);
  }

  async getOrderDetailById(id: number): Promise<OrderDetailResponseDto | null> {
    const detail = await this.orderDetailRepository.getOrderDetailById(id);
    if (!detail) {
      throw new NotFoundException('Chi tiết đơn hàng không tồn tại');
    }
    return detail;
  }

  async getOrderDetailsByOrder(
    orderId: number,
  ): Promise<OrderDetailResponseDto[]> {
    return this.orderDetailRepository.getOrderDetailsByOrder(orderId);
  }

  async deleteOrderDetail(id: number): Promise<OrderDetailResponseDto | null> {
    await this.orderDetailHelper.checkOrderDetail(id);
    return this.orderDetailRepository.deleteOrderDetail(id);
  }

  async deleteListOrderDetails(
    dto: DeleteListOrderDetailDto,
  ): Promise<{ count: number }> {
    const result = await this.orderDetailRepository.deleteListOrderDetails(dto);
    if (result.count === 0) {
      throw new NotFoundException(
        'Không tìm thấy chi tiết đơn hàng nào để xóa',
      );
    }
    return result;
  }
}
