import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteListOrderDto {
  @ArrayNotEmpty()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  Ids: number[];
}
