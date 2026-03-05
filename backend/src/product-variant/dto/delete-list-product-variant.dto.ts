import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteListProductVariantDto {
  @ArrayNotEmpty()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  Ids: number[];
}
