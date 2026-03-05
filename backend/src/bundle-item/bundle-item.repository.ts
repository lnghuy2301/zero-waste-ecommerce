import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BundleItemRequestDto } from './dto/bundle-item.request.dto';
import { BundleItemResponseDto } from './dto/bundle-item.response.dto';
import { DeleteListBundleItemDto } from './dto/delete-list-bundle-item.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class BundleItemRepository {
  constructor(private prismaService: PrismaService) {}

  async createBundleItem(
    data: BundleItemRequestDto,
  ): Promise<BundleItemResponseDto> {
    const created = await this.prismaService.bundleItem.create({
      data: {
        bundleProductId: data.bundleProductId,
        componentVariantId: data.componentVariantId,
        quantity: data.quantity,
      },
      include: { bundleProduct: true, componentVariant: true },
    });

    const transformed = {
      ...created,
      bundleProduct: created.bundleProduct
        ? { ...created.bundleProduct }
        : undefined, // không có price
      componentVariant: created.componentVariant
        ? {
            ...created.componentVariant,
            price: Number(created.componentVariant.price),
          }
        : undefined,
    };

    return plainToInstance(BundleItemResponseDto, transformed);
  }

  async updateBundleItem(
    id: number,
    data: BundleItemRequestDto,
  ): Promise<BundleItemResponseDto> {
    const updated = await this.prismaService.bundleItem.update({
      where: { id },
      data: {
        bundleProductId: data.bundleProductId,
        componentVariantId: data.componentVariantId,
        quantity: data.quantity,
      },
      include: { bundleProduct: true, componentVariant: true },
    });

    const transformed = {
      ...updated,
      bundleProduct: updated.bundleProduct
        ? { ...updated.bundleProduct }
        : undefined,
      componentVariant: updated.componentVariant
        ? {
            ...updated.componentVariant,
            price: Number(updated.componentVariant.price),
          }
        : undefined,
    };

    return plainToInstance(BundleItemResponseDto, transformed);
  }

  async getBundleItemById(id: number): Promise<BundleItemResponseDto | null> {
    const item = await this.prismaService.bundleItem.findUnique({
      where: { id },
      include: { bundleProduct: true, componentVariant: true },
    });

    if (!item) return null;

    const transformed = {
      ...item,
      bundleProduct: item.bundleProduct ? { ...item.bundleProduct } : undefined,
      componentVariant: item.componentVariant
        ? {
            ...item.componentVariant,
            price: Number(item.componentVariant.price),
          }
        : undefined,
    };

    return plainToInstance(BundleItemResponseDto, transformed);
  }

  async getAllBundleItems(): Promise<BundleItemResponseDto[]> {
    const items = await this.prismaService.bundleItem.findMany({
      include: { bundleProduct: true, componentVariant: true },
    });

    return items.map((item) => {
      const transformed = {
        ...item,
        bundleProduct: item.bundleProduct
          ? { ...item.bundleProduct }
          : undefined,
        componentVariant: item.componentVariant
          ? {
              ...item.componentVariant,
              price: Number(item.componentVariant.price),
            }
          : undefined,
      };
      return plainToInstance(BundleItemResponseDto, transformed);
    });
  }

  async deleteBundleItem(id: number): Promise<BundleItemResponseDto | null> {
    const deleted = await this.prismaService.bundleItem.delete({
      where: { id },
      include: { bundleProduct: true, componentVariant: true },
    });

    const transformed = {
      ...deleted,
      bundleProduct: deleted.bundleProduct
        ? { ...deleted.bundleProduct }
        : undefined,
      componentVariant: deleted.componentVariant
        ? {
            ...deleted.componentVariant,
            price: Number(deleted.componentVariant.price),
          }
        : undefined,
    };

    return plainToInstance(BundleItemResponseDto, transformed);
  }

  async deleteListBundleItems(
    dto: DeleteListBundleItemDto,
  ): Promise<{ count: number }> {
    const result = await this.prismaService.bundleItem.deleteMany({
      where: { id: { in: dto.Ids } },
    });
    return { count: result.count };
  }
}
