import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteListPromotionDto {
  @ArrayNotEmpty()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  Ids: number[];
}
