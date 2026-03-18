import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductVariantResponseDto } from './dto/product-variant.response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProductVariantHelper {
  constructor(private prismaService: PrismaService) {}

  async checkVariant(id: number): Promise<ProductVariantResponseDto> {
    const variant = await this.prismaService.productVariant.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!variant) {
      throw new NotFoundException('Biến thể sản phẩm không tồn tại');
    }

    // Fix: check price trước khi transform
    const safeVariant = {
      ...variant,
      price: variant.price ? Number(variant.price) : 0, // fallback nếu undefined
    };

    return plainToInstance(ProductVariantResponseDto, safeVariant);
  }
}
