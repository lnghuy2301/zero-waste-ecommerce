import { IsArray, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ApplyPromotionDto {
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  variantIds: number[];

  @IsOptional()
  @IsInt()
  promotionId?: number | null;
}
