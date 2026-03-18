import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderResponseDto } from './dto/order.response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class OrderHelper {
  constructor(private prismaService: PrismaService) {}

  async checkOrder(id: number): Promise<OrderResponseDto> {
    const order = await this.prismaService.order.findUnique({
      where: { id },
      include: { orderItems: { include: { variant: true } } },
    });

    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    const transformed = {
      ...order,
      totalAmount: Number(order.totalAmount),
      orderItems: order.orderItems.map((oi) => ({
        ...oi,
        price: Number(oi.price),
        variant: oi.variant
          ? {
              ...oi.variant,
              price: Number(oi.variant.price),
            }
          : undefined,
      })),
    };

    return plainToInstance(OrderResponseDto, transformed);
  }
}
