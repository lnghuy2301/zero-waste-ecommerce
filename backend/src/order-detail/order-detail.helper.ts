import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderDetailResponseDto } from './dto/order-detail.response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class OrderDetailHelper {
  constructor(private prismaService: PrismaService) {}

  async checkOrderDetail(id: number): Promise<OrderDetailResponseDto> {
    const detail = await this.prismaService.orderDetail.findUnique({
      where: { id },
      include: { variant: true },
    });

    if (!detail) {
      throw new NotFoundException('Chi tiết đơn hàng không tồn tại');
    }

    return plainToInstance(OrderDetailResponseDto, {
      ...detail,
      price: Number(detail.price),
    });
  }
}
