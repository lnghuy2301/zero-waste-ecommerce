import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class PaymentMethodRequestDto {
  @IsNotEmpty({ message: 'Tên phương thức thanh toán không được bỏ trống' })
  @IsString({ message: 'Tên phương thức thanh toán phải là chuỗi' })
  name: string;

  @IsNotEmpty({ message: 'Mã phương thức thanh toán không được bỏ trống' })
  @IsString({ message: 'Mã phương thức thanh toán phải là chuỗi' })
  code: string;

  @IsNotEmpty({ message: 'Trạng thái hoạt động không được bỏ trống' })
  @IsBoolean({ message: 'Trạng thái hoạt động phải là boolean' })
  isActive: boolean;
}
