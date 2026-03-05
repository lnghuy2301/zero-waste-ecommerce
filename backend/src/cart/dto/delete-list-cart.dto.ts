import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteListCartDto {
  @ArrayNotEmpty()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  Ids: number[];
}
