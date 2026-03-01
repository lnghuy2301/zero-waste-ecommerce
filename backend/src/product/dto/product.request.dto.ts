import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ProductStatus, ProductType } from '@prisma/client';

export class ProductRequestDto {
  @IsNotEmpty({ message: 'Tên sản phẩm không được bỏ trống' })
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty({ message: 'Slug không được bỏ trống' })
  @IsString()
  @MaxLength(255)
  slug: string;

  @IsNotEmpty({ message: 'Danh mục không được bỏ trống' })
  @IsInt()
  categoryId: number;

  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  material?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  ecoFriendliness?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  reusability?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  mainImage?: string;
}
