import {
    IsNotEmpty,
    IsString,
    IsOptional,
    MaxLength,
    IsDate, IsInt
} from 'class-validator';
import { Type } from 'class-transformer';

export class CustomerProfileRequestDto {
    @IsNotEmpty({ message: 'Họ tên không được để trống' })
    @IsString({ message: 'Họ tên phải là một chuỗi ký tự' })
    @MaxLength(100, { message: 'Họ tên không được vượt quá 100 ký tự' })
    fullName: string;

    @IsOptional()
    @IsString({ message: 'Số điện thoại không hợp lệ' })
    @MaxLength(15, { message: 'Số điện thoại không vượt quá 15 ký tự' })
    phone?: string;

    @IsOptional()
    @IsString({ message: 'Địa chỉ không hợp lệ' })
    @MaxLength(255, { message: 'Địa chỉ không vượt quá 255 ký tự' })
    address?: string;

    @IsOptional()
    @IsString({ message: 'Giới tính không hợp lệ' })
    @MaxLength(10, { message: 'Giới tính không vượt quá 10 ký tự' })
    gender?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: 'Ngày sinh không đúng chuẩn định dạng thời gian' })
    dob?: Date;
}