import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsNumber,
  Min,
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
  @Type(() => Number) // Tự động ép kiểu sang số nếu client lỡ gửi string
  @IsNumber({}, { message: 'Giá trị giảm phải là số' })
  @Min(0, { message: 'Giá trị giảm không được là số âm' })
  discountValue: string;

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
