import { IsInt, IsNotEmpty, IsString, Min, IsOptional } from 'class-validator';
// import { OrderStatus } from '@prisma/client';
export class OrderRequestDto {
  @IsNotEmpty({ message: 'ID tài khoản không được bỏ trống' })
  @IsInt()
  accountId: number;

  @IsNotEmpty({ message: 'Địa chỉ giao hàng không được bỏ trống' })
  @IsString()
  shippingAddress: string;

  @IsNotEmpty({ message: 'ID phương thức thanh toán không được bỏ trống' })
  @IsInt()
  paymentMethodId: number;

  // Danh sách chi tiết đơn hàng (items)
  @IsNotEmpty({ message: 'Danh sách sản phẩm không được bỏ trống' })
  items: OrderDetailRequestDto[];
}

export class OrderDetailRequestDto {
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
