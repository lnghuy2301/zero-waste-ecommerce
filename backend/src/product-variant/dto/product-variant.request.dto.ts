import {
  //   IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class ProductVariantRequestDto {
  @IsNotEmpty({ message: 'ID sản phẩm không được bỏ trống' })
  @IsInt()
  productId: number;

  @IsOptional()
  @IsInt()
  promotionId?: number;

  @IsNotEmpty({ message: 'SKU không được bỏ trống' })
  @IsString()
  @MaxLength(50)
  sku: string;

  @IsNotEmpty({ message: 'Tên biến thể không được bỏ trống' })
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty({ message: 'Giá bán không được bỏ trống' })
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty({ message: 'Tồn kho không được bỏ trống' })
  @IsInt()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  weight?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  volume?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  size?: string;
}
