import { Expose } from 'class-transformer';
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
  discountValue: number;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Expose()
  isActive: boolean;
}
