import { Injectable, NotFoundException } from '@nestjs/common';
import { BundleItemRepository } from './bundle-item.repository';
import { BundleItemHelper } from './bundle-item.helper';
import { BundleItemRequestDto } from './dto/bundle-item.request.dto';
import { BundleItemResponseDto } from './dto/bundle-item.response.dto';
import { DeleteListBundleItemDto } from './dto/delete-list-bundle-item.dto';

@Injectable()
export class BundleItemService {
  constructor(
    private bundleItemRepository: BundleItemRepository,
    private bundleItemHelper: BundleItemHelper,
  ) {}

  async createBundleItem(
    dto: BundleItemRequestDto,
  ): Promise<BundleItemResponseDto> {
    return this.bundleItemRepository.createBundleItem(dto);
  }

  async updateBundleItem(
    id: number,
    dto: BundleItemRequestDto,
  ): Promise<BundleItemResponseDto> {
    await this.bundleItemHelper.checkBundleItem(id);
    return this.bundleItemRepository.updateBundleItem(id, dto);
  }

  async getBundleItemById(id: number): Promise<BundleItemResponseDto | null> {
    const item = await this.bundleItemRepository.getBundleItemById(id);
    if (!item) {
      throw new NotFoundException('Chi tiết set quà tặng không tồn tại');
    }
    return item;
  }

  async getAllBundleItems(): Promise<BundleItemResponseDto[]> {
    return this.bundleItemRepository.getAllBundleItems();
  }

  async deleteBundleItem(id: number): Promise<BundleItemResponseDto | null> {
    await this.bundleItemHelper.checkBundleItem(id);
    return this.bundleItemRepository.deleteBundleItem(id);
  }

  async deleteListBundleItems(
    dto: DeleteListBundleItemDto,
  ): Promise<{ count: number }> {
    const result = await this.bundleItemRepository.deleteListBundleItems(dto);
    if (result.count === 0) {
      throw new NotFoundException(
        'Không tìm thấy chi tiết set quà tặng nào để xóa',
      );
    }
    return result;
  }
}
