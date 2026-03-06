import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrderHelper {
  constructor(private prismaService: PrismaService) {}

  async checkOrder(id: number): Promise<void> {
    const order = await this.prismaService.order.findUnique({
      where: { id },
      select: { id: true }, // chỉ lấy id để check tồn tại, không include gì để tránh lỗi Decimal
    });

    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }
  }
}
