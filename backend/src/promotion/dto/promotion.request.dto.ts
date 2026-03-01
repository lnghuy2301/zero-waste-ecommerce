import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { DiscountType } from '@prisma/client';

export class PromotionRequestDto {
  @IsNotEmpty({ message: 'Mã khuyến mãi không được bỏ trống' })
  @IsString()
  @MaxLength(50)
  code: string;

  @IsNotEmpty({ message: 'Tên chương trình không được bỏ trống' })
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty({ message: 'Loại giảm giá không được bỏ trống' })
  @IsEnum(DiscountType)
  discountType: DiscountType;

  @IsNotEmpty({ message: 'Giá trị giảm không được bỏ trống' })
  @IsString({ message: 'Giá trị giảm phải là chuỗi số' }) // đổi thành IsString
  discountValue: string; // đổi type thành string

  @IsNotEmpty({ message: 'Ngày bắt đầu không được bỏ trống' })
  @IsDateString()
  startDate: string;

  @IsNotEmpty({ message: 'Ngày kết thúc không được bỏ trống' })
  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
