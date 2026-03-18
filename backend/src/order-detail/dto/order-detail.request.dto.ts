import { IsInt, IsNotEmpty, Min, IsOptional } from 'class-validator';

export class OrderDetailRequestDto {
  @IsNotEmpty({ message: 'ID đơn hàng không được bỏ trống' })
  @IsInt()
  orderId: number;

  @IsNotEmpty({ message: 'ID biến thể không được bỏ trống' })
  @IsInt()
  variantId: number;

  @IsOptional()
  @IsInt()
  bundleId?: number;

  @IsNotEmpty({ message: 'Số lượng không được bỏ trống' })
  @IsInt()
  @Min(1)
  quantity: number;
}
