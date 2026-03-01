import {IsEnum, IsNotEmpty} from "class-validator";
import {Role} from "@prisma/client";

export class UpdateRoleRequesrDto {
    @IsNotEmpty()
    @IsEnum(Role, { message: 'Quyền không hợp lệ (Chỉ chấp nhận ADMIN hoặc CUSTOMER)' })
    role: Role;
}