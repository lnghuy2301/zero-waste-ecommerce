import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteListBundleItemDto {
  @ArrayNotEmpty()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  Ids: number[];
}
