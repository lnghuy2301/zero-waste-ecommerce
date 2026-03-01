import { Exclude, Expose, Type } from 'class-transformer';
import { Role } from '@prisma/client';
import { CustomerProfileResponseDto } from '../../customer_profile/dto/customer_profile.response.dto';

export class Account_profileResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  role: Role;

  @Expose()
  isActive: boolean;

  @Expose()
  @Type(() => CustomerProfileResponseDto)
  profile: CustomerProfileResponseDto | null;

  constructor(partial: Partial<Account_profileResponseDto>) {
    Object.assign(this, partial);
    //this: lấy dữ liệu từ file này
    //partial: gôm cục dữ liệu từ AccountResponseDto
  }
}
