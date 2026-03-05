import {IsBoolean, IsNotEmpty, IsString} from "class-validator";

export class Payment_methodRequestDto {
    @IsNotEmpty({message: "Tên phương thức thanh toán không được bỏ trống"})
    @IsString({message: "Tên phương thức thanh toán phải là kiểu string"})
    name: string;

    @IsNotEmpty({message: "Mã phương thức thanh toán không được bỏ trống"})
    @IsString({message: "Mã phương thức thanh toán phải là kiểu string"})
    code: string;

    @IsNotEmpty({message: "Hoạt động không được bỏ trống"})
    @IsBoolean({message: "Hoa động phải là kiểu boolean"})
    isActive: boolean;
}