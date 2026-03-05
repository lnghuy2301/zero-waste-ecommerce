import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderDetailRequestDto } from './dto/order-detail.request.dto';
import { OrderDetailResponseDto } from './dto/order-detail.response.dto';
import { DeleteListOrderDetailDto } from './dto/delete-list-order-detail.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class OrderDetailRepository {
  constructor(private prismaService: PrismaService) {}

  async createOrderDetail(
    dto: OrderDetailRequestDto,
  ): Promise<OrderDetailResponseDto> {
    const order = await this.prismaService.order.findUnique({
      where: { id: dto.orderId },
    });
    if (!order) throw new Error('Đơn hàng không tồn tại');

    const variant = await this.prismaService.productVariant.findUnique({
      where: { id: dto.variantId },
    });
    if (!variant) throw new Error('Variant không tồn tại');

    const created = await this.prismaService.orderDetail.create({
      data: {
        orderId: dto.orderId,
        variantId: dto.variantId,
        bundleId: dto.bundleId,
        quantity: dto.quantity,
        price: variant.price,
      },
      include: { variant: true },
    });

    return plainToInstance(OrderDetailResponseDto, {
      ...created,
      price: Number(created.price),
      variant: created.variant
        ? {
            ...created.variant,
            price: Number(created.variant.price),
          }
        : undefined,
    });
  }
  async updateOrderDetail(
    id: number,
    dto: OrderDetailRequestDto,
  ): Promise<OrderDetailResponseDto> {
    const variant = await this.prismaService.productVariant.findUnique({
      where: { id: dto.variantId },
    });
    if (!variant) throw new Error('Variant không tồn tại');

    const updated = await this.prismaService.orderDetail.update({
      where: { id },
      data: {
        orderId: dto.orderId,
        variantId: dto.variantId,
        bundleId: dto.bundleId,
        quantity: dto.quantity,
        price: variant.price,
      },
      include: { variant: true },
    });

    return plainToInstance(OrderDetailResponseDto, {
      ...updated,
      price: Number(updated.price),
      variant: updated.variant
        ? {
            ...updated.variant,
            price: Number(updated.variant.price),
          }
        : undefined,
    });
  }

  async getOrderDetailById(id: number): Promise<OrderDetailResponseDto | null> {
    const detail = await this.prismaService.orderDetail.findUnique({
      where: { id },
      include: { variant: true },
    });

    if (!detail) return null;

    return plainToInstance(OrderDetailResponseDto, {
      ...detail,
      price: Number(detail.price),
      variant: detail.variant
        ? {
            ...detail.variant,
            price: Number(detail.variant.price),
          }
        : undefined,
    });
  }

  async getOrderDetailsByOrder(
    orderId: number,
  ): Promise<OrderDetailResponseDto[]> {
    const details = await this.prismaService.orderDetail.findMany({
      where: { orderId },
      include: { variant: true },
    });

    return details.map((detail) => ({
      ...detail,
      price: Number(detail.price),
      variant: detail.variant
        ? {
            ...detail.variant,
            price: Number(detail.variant.price),
          }
        : undefined,
    }));
  }

  async deleteOrderDetail(id: number): Promise<OrderDetailResponseDto | null> {
    const deleted = await this.prismaService.orderDetail.delete({
      where: { id },
      include: { variant: true },
    });

    return plainToInstance(OrderDetailResponseDto, {
      ...deleted,
      price: Number(deleted.price),
      variant: deleted.variant
        ? {
            ...deleted.variant,
            price: Number(deleted.variant.price),
          }
        : undefined,
    });
  }

  async deleteListOrderDetails(
    dto: DeleteListOrderDetailDto,
  ): Promise<{ count: number }> {
    const result = await this.prismaService.orderDetail.deleteMany({
      where: { id: { in: dto.Ids } },
    });
    return { count: result.count };
  }
}
