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
  material: string | null; // ← bổ sung

  @Expose()
  ecoFriendliness: number | null; // ← bổ sung

  @Expose()
  reusability: string | null; // ← bổ sung

  @Expose()
  mainImage: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  soLuongDaBan: number; // ← bổ sung (đã có nhưng đảm bảo)

  @Expose()
  danhGiaTrungBinh: number | null;

  @Expose()
  soLuongDanhGia: number;

  @Expose()
  @Type(() => CategoryResponseDto)
  category?: CategoryResponseDto;

  @Expose()
  greenCerts?: any[]; // ← bổ sung để hiển thị chứng nhận xanh
}
