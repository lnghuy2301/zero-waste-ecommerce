import { Expose, Type, Transform } from 'class-transformer';
import { ProductVariantResponseDto } from '../../product-variant/dto/product-variant.response.dto';

export class OrderDetailResponseDto {
  @Expose()
  id: number;

  @Expose()
  orderId: number;

  @Expose()
  variantId: number;

  @Expose()
  bundleId: number | null;

  @Expose()
  quantity: number;

  @Expose()
  @Transform(({ value }) => Number(value))
  price: number;

  @Expose()
  @Type(() => ProductVariantResponseDto)
  variant?: ProductVariantResponseDto;
}
