import { Expose } from 'class-transformer';

export class PaymentMethodResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  code: string;

  @Expose()
  isActive: boolean;
}
