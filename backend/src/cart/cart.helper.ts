import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CartResponseDto } from './dto/cart.response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CartHelper {
  constructor(private prismaService: PrismaService) {}

  async checkCartItem(id: number): Promise<CartResponseDto> {
    const item = await this.prismaService.cart.findUnique({
      where: { id },
      include: { variant: true },
    });

    if (!item) {
      throw new NotFoundException('Mặt hàng trong giỏ không tồn tại');
    }

    // Fix DecimalError: convert price thủ công trước khi plainToInstance
    const safeItem = {
      ...item,
      variant: item.variant
        ? {
            ...item.variant,
            price: item.variant.price ? Number(item.variant.price) : 0,
          }
        : undefined,
    };

    return plainToInstance(CartResponseDto, safeItem);
  }
}
