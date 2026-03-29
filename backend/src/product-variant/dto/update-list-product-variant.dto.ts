import { IsArray, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateListProductVariantDto {
  @IsNotEmpty({ message: 'Danh sách Ids không được bỏ trống' })
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  Ids: number[]; // danh sách variantId

  @IsOptional()
  @IsInt()
  promotionId?: number | null;
}
