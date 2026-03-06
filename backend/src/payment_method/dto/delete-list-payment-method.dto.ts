import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteListPaymentMethodDto {
  @ArrayNotEmpty({ message: 'Danh sách ID không được rỗng' })
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  Ids: number[];
}
