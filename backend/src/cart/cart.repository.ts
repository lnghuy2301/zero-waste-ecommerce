import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CartRequestDto } from './dto/cart.request.dto';
import { CartResponseDto } from './dto/cart.response.dto';
import { DeleteListCartDto } from './dto/delete-list-cart.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CartRepository {
  constructor(private prismaService: PrismaService) {}

  async addToCart(data: CartRequestDto): Promise<CartResponseDto> {
    const created = await this.prismaService.cart.create({
      data: {
        accountId: data.accountId,
        variantId: data.variantId,
        bundleId: data.bundleId,
        quantity: data.quantity,
      },
      include: { variant: true },
    });

    // Convert price Decimal về number trước khi instance
    const transformed = {
      ...created,
      variant: created.variant
        ? {
            ...created.variant,
            price: Number(created.variant.price),
          }
        : undefined,
    };

    return plainToInstance(CartResponseDto, transformed);
  }

  async updateCartItem(
    id: number,
    data: CartRequestDto,
  ): Promise<CartResponseDto> {
    const updated = await this.prismaService.cart.update({
      where: { id },
      data: {
        variantId: data.variantId,
        bundleId: data.bundleId,
        quantity: data.quantity,
      },
      include: { variant: true },
    });

    const transformed = {
      ...updated,
      variant: updated.variant
        ? {
            ...updated.variant,
            price: Number(updated.variant.price),
          }
        : undefined,
    };

    return plainToInstance(CartResponseDto, transformed);
  }

  async getCartByUser(accountId: number): Promise<CartResponseDto[]> {
    const items = await this.prismaService.cart.findMany({
      where: { accountId },
      include: { variant: true },
    });

    return items.map((item) => {
      const transformed = {
        ...item,
        variant: item.variant
          ? {
              ...item.variant,
              price: Number(item.variant.price),
            }
          : undefined,
      };
      return plainToInstance(CartResponseDto, transformed);
    });
  }

  async getCartItemById(id: number): Promise<CartResponseDto | null> {
    const item = await this.prismaService.cart.findUnique({
      where: { id },
      include: { variant: true },
    });

    if (!item) return null;

    const transformed = {
      ...item,
      variant: item.variant
        ? {
            ...item.variant,
            price: Number(item.variant.price),
          }
        : undefined,
    };

    return plainToInstance(CartResponseDto, transformed);
  }

  async removeCartItem(id: number): Promise<CartResponseDto | null> {
    const deleted = await this.prismaService.cart.delete({
      where: { id },
      include: { variant: true },
    });

    const transformed = {
      ...deleted,
      variant: deleted.variant
        ? {
            ...deleted.variant,
            price: Number(deleted.variant.price),
          }
        : undefined,
    };

    return plainToInstance(CartResponseDto, transformed);
  }

  async clearCartItems(dto: DeleteListCartDto): Promise<{ count: number }> {
    const result = await this.prismaService.cart.deleteMany({
      where: { id: { in: dto.Ids } },
    });
    return { count: result.count };
  }
}
