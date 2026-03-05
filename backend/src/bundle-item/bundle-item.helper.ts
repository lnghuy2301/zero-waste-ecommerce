import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BundleItemResponseDto } from './dto/bundle-item.response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class BundleItemHelper {
  constructor(private prismaService: PrismaService) {}

  async checkBundleItem(id: number): Promise<BundleItemResponseDto> {
    const item = await this.prismaService.bundleItem.findUnique({
      where: { id },
      include: { bundleProduct: true, componentVariant: true },
    });

    if (!item) {
      throw new NotFoundException('Chi tiết set quà tặng không tồn tại');
    }

    return plainToInstance(BundleItemResponseDto, item);
  }
}
