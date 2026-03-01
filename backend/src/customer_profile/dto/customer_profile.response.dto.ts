import { Expose } from 'class-transformer';

export class CustomerProfileResponseDto {
    @Expose()
    id: number;

    @Expose()
    fullName: string;

    @Expose()
    phone: string | null;

    @Expose()
    address: string | null;

    @Expose()
    gender: string | null;

    @Expose()
    dob: Date | null;

    @Expose()
    accountId: number;

    constructor(partial: Partial<CustomerProfileResponseDto>) {
        Object.assign(this, partial);
    }
}