import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteListCommentDto {
  @ArrayNotEmpty({ message: 'Danh sách ID không được để trống' })
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  Ids: number[];
}
