import { Expose, Type } from 'class-transformer';
import { ProductResponseDto } from '../../product/dto/product.response.dto';
import { ProductVariantResponseDto } from '../../product-variant/dto/product-variant.response.dto';

export class BundleItemResponseDto {
  @Expose()
  id: number;

  @Expose()
  bundleProductId: number;

  @Expose()
  componentVariantId: number;

  @Expose()
  quantity: number;

  @Expose()
  @Type(() => ProductResponseDto)
  bundleProduct?: ProductResponseDto;

  @Expose()
  @Type(() => ProductVariantResponseDto)
  componentVariant?: ProductVariantResponseDto;
}
