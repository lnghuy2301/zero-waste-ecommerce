import { Expose, Type, Transform } from 'class-transformer';
import { ProductResponseDto } from '../../product/dto/product.response.dto';

export class ProductVariantResponseDto {
  @Expose()
  id: number;

  @Expose()
  productId: number;

  @Expose()
  promotionId: number | null;

  @Expose()
  sku: string;

  @Expose()
  name: string;

  @Expose()
  @Transform(({ value }) => Number(value)) // tự động convert Decimal từ DB về number
  price: number;

  @Expose()
  stock: number;

  @Expose()
  weight: number | null;

  @Expose()
  volume: number | null;

  @Expose()
  color: string | null;

  @Expose()
  size: string | null;

  @Expose()
  @Type(() => ProductResponseDto)
  product?: ProductResponseDto;
}
