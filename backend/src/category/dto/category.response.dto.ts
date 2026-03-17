import { Expose } from 'class-transformer';

export class CategoryResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string | null;

  @Expose()
  image: string | null; // THÊM NẾU MUỐN TRẢ VỀ KHI GET
}
