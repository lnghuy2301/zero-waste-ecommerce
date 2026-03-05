import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class BundleItemRequestDto {
  @IsNotEmpty({ message: 'ID sản phẩm bundle không được bỏ trống' })
  @IsInt()
  bundleProductId: number;

  @IsNotEmpty({ message: 'ID biến thể thành phần không được bỏ trống' })
  @IsInt()
  componentVariantId: number;

  @IsNotEmpty({ message: 'Số lượng không được bỏ trống' })
  @IsInt()
  @Min(1)
  quantity: number;
}
