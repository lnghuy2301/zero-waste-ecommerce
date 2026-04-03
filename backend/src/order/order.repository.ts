import { Injectable, BadRequestException } from '@nestjs/common';
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
    // 1. Lấy thông tin giá và tồn kho của các variants trước khi bắt đầu transaction
    const itemsWithDetails = await Promise.all(
        dto.items.map(async (item) => {
          const variant = await this.prismaService.productVariant.findUnique({
            where: { id: item.variantId },
            select: { price: true, stock: true, name: true }, // Lấy thêm stock và name
          });
          if (!variant)
            throw new BadRequestException(`Biến thể ${item.variantId} không tồn tại`);

          // Kiểm tra tồn kho trước khi tạo
          if (variant.stock < item.quantity) {
            throw new BadRequestException(
                `Sản phẩm "${variant.name}" chỉ còn ${variant.stock} cái, không đủ để đặt ${item.quantity} cái!`
            );
          }

          return {
            variantId: item.variantId,
            bundleId: item.bundleId,
            quantity: item.quantity,
            price: variant.price,
          };
        }),
    );

    // 2. Tính tổng số tiền
    const totalAmount = itemsWithDetails.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0,
    );

    // 3. Sử dụng Prisma Transaction để Tạo Đơn, Tạo Chi Tiết và Trừ Kho cùng lúc
    const createdOrder = await this.prismaService.$transaction(async (tx) => {
      // 3.1. Tạo đơn hàng và chi tiết đơn hàng
      const order = await tx.order.create({
        data: {
          code: `ORD-${Date.now().toString().slice(-8)}${Math.floor(
              Math.random() * 10000,
          ).toString().padStart(4, '0')}`,
          accountId: dto.accountId,
          totalAmount: new Prisma.Decimal(totalAmount.toFixed(2)),
          status: 'PENDING' as OrderStatus,
          shippingAddress: dto.shippingAddress,
          paymentMethodId: dto.paymentMethodId,
          orderItems: {
            create: itemsWithDetails.map((item) => ({
              variantId: item.variantId,
              bundleId: item.bundleId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: { orderItems: { include: { variant: true } } },
      });

      // 3.2. Trừ tồn kho an toàn cho từng sản phẩm
      for (const item of itemsWithDetails) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    });

    // 4. Convert Decimal về number ở mọi level để tránh DecimalError
    const transformedOrder = {
      ...createdOrder,
      totalAmount: Number(createdOrder.totalAmount),
      orderItems: createdOrder.orderItems.map((oi) => ({
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
    // Sử dụng Transaction: Vừa chuyển trạng thái thành CANCELLED, vừa hoàn lại kho
    const cancelledOrder = await this.prismaService.$transaction(async (tx) => {
      // 1. Kiểm tra đơn hàng có tồn tại và chưa bị hủy không
      const order = await tx.order.findUnique({
        where: { id },
        include: { orderItems: true },
      });

      if (!order) {
        throw new BadRequestException('Đơn hàng không tồn tại');
      }

      if (order.status === 'CANCELLED') {
        throw new BadRequestException('Đơn hàng này đã được hủy từ trước');
      }

      // 2. Chuyển trạng thái đơn hàng sang CANCELLED
      const updatedOrder = await tx.order.update({
        where: { id },
        data: { status: 'CANCELLED' as OrderStatus },
        include: { orderItems: { include: { variant: true } } },
      });

      // 3. HOÀN LẠI KHO (Cộng lại số lượng đã đặt vào tồn kho)
      for (const item of order.orderItems) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              increment: item.quantity, // Lệnh increment cộng dồn an toàn
            },
          },
        });
      }

      return updatedOrder;
    });

    // 4. Trả về dữ liệu đã transform (Ép Decimal về Number để không lỗi JSON)
    const transformed = {
      ...cancelledOrder,
      totalAmount: Number(cancelledOrder.totalAmount),
      orderItems: cancelledOrder.orderItems.map((oi) => ({
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

  async getOrderCount(): Promise<number> {
    const count = await this.prismaService.order.count();
    return count;
  }

  async getRevenueByMonth() {
    const result = await this.prismaService.order.groupBy({
      by: ['createdAt'],
      where: {
        status: 'COMPLETED',
      },
      _sum: {
        totalAmount: true,
      },
    });

    // Nhóm theo tháng (1-12)
    const monthlyRevenue = Array(12).fill(0);

    result.forEach((item) => {
      const month = new Date(item.createdAt).getMonth(); // 0-11
      monthlyRevenue[month] = Number(item._sum.totalAmount || 0);
    });

    return monthlyRevenue; // trả về mảng 12 số [tháng 1, tháng 2, ..., tháng 12]
  }

  async getAllOrders(): Promise<OrderResponseDto[]> {
    const orders = await this.prismaService.order.findMany({
      include: {
        orderItems: {
          include: { variant: true },
        },
      },
      orderBy: { createdAt: 'desc' },
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

  async getStats() {
    const [
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenueResult,
      monthlyRaw,
      statusRaw,
    ] = await Promise.all([
      this.prismaService.account.count(),
      this.prismaService.order.count(),
      this.prismaService.product.count(),
      this.prismaService.order.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalAmount: true },
      }),
      this.prismaService.order.groupBy({
        by: ['createdAt'],
        where: { status: 'COMPLETED' },
        _sum: { totalAmount: true },
      }),
      this.prismaService.order.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
    ]);

    const monthlyRevenue = Array(12).fill(0);
    monthlyRaw.forEach((item) => {
      const month = new Date(item.createdAt).getMonth();
      monthlyRevenue[month] = Number(item._sum.totalAmount || 0);
    });

    const statusCount: Record<string, number> = {};
    statusRaw.forEach((item) => {
      statusCount[item.status] = item._count.id;
    });

    return {
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue: Number(totalRevenueResult._sum.totalAmount || 0), // ← sửa chỗ này
      monthlyRevenue,
      statusCount,
    };
  }
}