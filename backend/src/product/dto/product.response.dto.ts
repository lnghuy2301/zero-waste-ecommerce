import { Expose, Type } from 'class-transformer';
import { ProductStatus, ProductType } from '@prisma/client';
import { CategoryResponseDto } from '../../category/dto/category.response.dto';

export class ProductResponseDto {
  @Expose()
  id: number;

  @Expose()
  categoryId: number;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  type: ProductType;

  @Expose()
  status: ProductStatus;

  @Expose()
  description: string | null;

  @Expose()
  material: string | null;

  @Expose()
  ecoFriendliness: number | null;

  @Expose()
  reusability: string | null;

  @Expose()
  mainImage: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => CategoryResponseDto)
  category?: CategoryResponseDto;
}
