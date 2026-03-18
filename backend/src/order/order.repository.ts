import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderRequestDto } from './dto/order.request.dto';
import { OrderResponseDto } from './dto/order.response.dto';
import { DeleteListOrderDto } from './dto/delete-list-order.dto';
import { plainToInstance } from 'class-transformer';
import { Prisma, OrderStatus } from '@prisma/client';

@Injectable()
export class OrderRepository {
  constructor(private prismaService: PrismaService) {}

  async createOrder(dto: OrderRequestDto): Promise<OrderResponseDto> {
    // Lấy price từ variant trước để tính total và create orderItems
    const itemsWithPrice = await Promise.all(
      dto.items.map(async (item) => {
        const variant = await this.prismaService.productVariant.findUnique({
          where: { id: item.variantId },
          select: { price: true },
        });
        if (!variant)
          throw new Error(`Variant ${item.variantId} không tồn tại`);
        return {
          variantId: item.variantId,
          bundleId: item.bundleId,
          quantity: item.quantity,
          price: variant.price,
        };
      }),
    );

    const totalAmount = itemsWithPrice.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );

    const created = await this.prismaService.order.create({
      data: {
        code: `ORD-${Date.now().toString().slice(-8)}${Math.floor(
          Math.random() * 10000,
        )
          .toString()
          .padStart(4, '0')}`,
        accountId: dto.accountId,
        totalAmount: new Prisma.Decimal(totalAmount.toFixed(2)),
        status: 'PENDING' as OrderStatus,
        shippingAddress: dto.shippingAddress,
        paymentMethodId: dto.paymentMethodId,
        orderItems: {
          create: itemsWithPrice.map((item) => ({
            variantId: item.variantId,
            bundleId: item.bundleId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { orderItems: { include: { variant: true } } },
    });

    // Convert Decimal về number ở mọi level để tránh DecimalError
    const transformedOrder = {
      ...created,
      totalAmount: Number(created.totalAmount),
      orderItems: created.orderItems.map((oi) => ({
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

    return plainToInstance(OrderResponseDto, transformedOrder);
  }

  async updateOrderStatus(
    id: number,
    status: OrderStatus,
  ): Promise<OrderResponseDto> {
    const updated = await this.prismaService.order.update({
      where: { id },
      data: { status },
      include: { orderItems: { include: { variant: true } } },
    });

    const transformed = {
      ...updated,
      totalAmount: Number(updated.totalAmount),
      orderItems: updated.orderItems.map((oi) => ({
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

  async getOrdersByUser(accountId: number): Promise<OrderResponseDto[]> {
    const orders = await this.prismaService.order.findMany({
      where: { accountId },
      include: { orderItems: { include: { variant: true } } },
    });

    return orders.map((order) => {
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
    });
  }

  async getOrderById(id: number): Promise<OrderResponseDto | null> {
    const order = await this.prismaService.order.findUnique({
      where: { id },
      include: { orderItems: { include: { variant: true } } },
    });

    if (!order) return null;

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

  async cancelOrder(id: number): Promise<OrderResponseDto | null> {
    const cancelled = await this.prismaService.order.update({
      where: { id },
      data: { status: 'CANCELLED' as OrderStatus },
      include: { orderItems: { include: { variant: true } } },
    });

    const transformed = {
      ...cancelled,
      totalAmount: Number(cancelled.totalAmount),
      orderItems: cancelled.orderItems.map((oi) => ({
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

  async deleteListOrders(dto: DeleteListOrderDto): Promise<{ count: number }> {
    const result = await this.prismaService.order.deleteMany({
      where: { id: { in: dto.Ids } },
    });
    return { count: result.count };
  }
}
