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

    return plainToInstance(CartResponseDto, item);
  }
}
