import {Exclude, Expose} from "class-transformer";
import {Role} from "@prisma/client"

export class AccountResponseDto {
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
}