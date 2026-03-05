import { Expose, Type, Transform } from 'class-transformer';
import { ProductVariantResponseDto } from '../../product-variant/dto/product-variant.response.dto';

export class CartResponseDto {
  @Expose()
  id: number;

  @Expose()
  accountId: number;

  @Expose()
  variantId: number;

  @Expose()
  bundleId: number | null;

  @Expose()
  quantity: number;

  @Expose()
  @Type(() => ProductVariantResponseDto)
  @Transform(({ obj }) => {
    if (obj.variant) {
      return {
        ...obj.variant,
        price: Number(obj.variant.price),
      };
    }
    return undefined;
  })
  variant?: ProductVariantResponseDto;
}
