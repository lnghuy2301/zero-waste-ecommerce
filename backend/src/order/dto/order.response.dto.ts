import { Expose, Type, Transform } from 'class-transformer';
import { OrderStatus } from '@prisma/client';
import { OrderDetailResponseDto } from './order-detail.response.dto';

export class OrderResponseDto {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  accountId: number;

  @Expose()
  @Transform(({ value }) => Number(value))
  totalAmount: number;

  @Expose()
  status: OrderStatus;

  @Expose()
  shippingAddress: string;

  @Expose()
  paymentMethodId: number;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => OrderDetailResponseDto)
  orderItems: OrderDetailResponseDto[];
}
