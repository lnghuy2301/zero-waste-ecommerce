import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductVariantRequestDto } from './dto/product-variant.request.dto';
import { ProductVariantResponseDto } from './dto/product-variant.response.dto';
import { DeleteListProductVariantDto } from './dto/delete-list-product-variant.dto';
import { plainToInstance } from 'class-transformer';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductVariantRepository {
  constructor(private prismaService: PrismaService) {}

  async createVariant(
    data: ProductVariantRequestDto,
  ): Promise<ProductVariantResponseDto> {
    const created = await this.prismaService.productVariant.create({
      data: {
        productId: data.productId,
        promotionId: data.promotionId,
        sku: data.sku,
        name: data.name,
        price: new Prisma.Decimal(data.price.toFixed(2)), // an toàn với number
        stock: data.stock,
        weight: data.weight,
        volume: data.volume,
        color: data.color,
        size: data.size,
      },
      include: { product: true },
    });

    // Convert Decimal về number trước khi instance để tránh lỗi
    return plainToInstance(ProductVariantResponseDto, {
      ...created,
      price: Number(created.price),
    });
  }

  async updateVariant(
    id: number,
    data: ProductVariantRequestDto,
  ): Promise<ProductVariantResponseDto> {
    const updated = await this.prismaService.productVariant.update({
      where: { id },
      data: {
        productId: data.productId,
        promotionId: data.promotionId,
        sku: data.sku,
        name: data.name,
        price: new Prisma.Decimal(data.price.toFixed(2)),
        stock: data.stock,
        weight: data.weight,
        volume: data.volume,
        color: data.color,
        size: data.size,
      },
      include: { product: true },
    });

    return plainToInstance(ProductVariantResponseDto, {
      ...updated,
      price: Number(updated.price),
    });
  }

  async getVariantById(id: number): Promise<ProductVariantResponseDto | null> {
    const variant = await this.prismaService.productVariant.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!variant) return null;

    return plainToInstance(ProductVariantResponseDto, {
      ...variant,
      price: Number(variant.price),
    });
  }

  async getAllVariants(): Promise<ProductVariantResponseDto[]> {
    const variants = await this.prismaService.productVariant.findMany({
      include: { product: true },
    });

    return variants.map((v) =>
      plainToInstance(ProductVariantResponseDto, {
        ...v,
        price: Number(v.price),
      }),
    );
  }

  async deleteVariant(id: number): Promise<ProductVariantResponseDto | null> {
    const deleted = await this.prismaService.productVariant.delete({
      where: { id },
      include: { product: true },
    });

    return plainToInstance(ProductVariantResponseDto, {
      ...deleted,
      price: Number(deleted.price),
    });
  }

  async deleteListVariants(
    dto: DeleteListProductVariantDto,
  ): Promise<{ count: number }> {
    const result = await this.prismaService.productVariant.deleteMany({
      where: { id: { in: dto.Ids } },
    });
    return { count: result.count };
  }
}
