import { Expose, Transform } from 'class-transformer';
import { DiscountType } from '@prisma/client';

export class PromotionResponseDto {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  discountType: DiscountType;

  @Expose()
  @Transform(({ value }) => Number(value)) // tự động convert Decimal về number
  discountValue: number;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Expose()
  isActive: boolean;
}
