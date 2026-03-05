import {
  BadRequestException,
  Injectable,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { ProductVariantRepository } from './product-variant.repository';
import { ProductVariantHelper } from './product-variant.helper';
import { ProductVariantRequestDto } from './dto/product-variant.request.dto';
import { ProductVariantResponseDto } from './dto/product-variant.response.dto';
import { DeleteListProductVariantDto } from './dto/delete-list-product-variant.dto';
import { AccountHelper } from '../account/account.helper';

@Injectable()
export class ProductVariantService {
  constructor(
    private productVariantRepository: ProductVariantRepository,
    private productVariantHelper: ProductVariantHelper,
    private accountHelper: AccountHelper,
  ) {}

  async createVariant(
    dto: ProductVariantRequestDto,
  ): Promise<ProductVariantResponseDto> {
    try {
      if (typeof dto.price !== 'number' || dto.price <= 0) {
        throw new BadRequestException('Giá phải là số dương hợp lệ');
      }
      return await this.productVariantRepository.createVariant(dto);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.accountHelper.handleError(error);
    }
  }

  // Tương tự cho updateVariant
  async updateVariant(
    id: number,
    dto: ProductVariantRequestDto,
  ): Promise<ProductVariantResponseDto> {
    try {
      if (typeof dto.price !== 'number' || dto.price <= 0) {
        throw new BadRequestException('Giá phải là số dương hợp lệ');
      }
      await this.productVariantHelper.checkVariant(id);
      return await this.productVariantRepository.updateVariant(id, dto);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.accountHelper.handleError(error);
    }
  }

  async getVariantById(id: number): Promise<ProductVariantResponseDto | null> {
    try {
      const variant = await this.productVariantRepository.getVariantById(id);
      if (!variant) {
        throw new NotFoundException('Biến thể sản phẩm không tồn tại');
      }
      return variant;
    } catch (error) {
      this.accountHelper.handleError(error);
    }
  }

  async getAllVariants(): Promise<ProductVariantResponseDto[]> {
    try {
      const variants = await this.productVariantRepository.getAllVariants();
      if (variants.length === 0) {
        throw new BadRequestException('Không có biến thể sản phẩm nào tồn tại');
      }
      return variants;
    } catch (error) {
      this.accountHelper.handleError(error);
    }
  }

  async deleteVariant(id: number): Promise<ProductVariantResponseDto | null> {
    try {
      await this.productVariantHelper.checkVariant(id);
      return await this.productVariantRepository.deleteVariant(id);
    } catch (error) {
      this.accountHelper.handleError(error);
    }
  }

  async deleteListVariants(
    dto: DeleteListProductVariantDto,
  ): Promise<{ count: number }> {
    try {
      const result =
        await this.productVariantRepository.deleteListVariants(dto);
      if (result.count === 0) {
        throw new NotFoundException('Không tìm thấy biến thể nào để xóa');
      }
      return result;
    } catch (error) {
      this.accountHelper.handleError(error);
    }
  }
}
