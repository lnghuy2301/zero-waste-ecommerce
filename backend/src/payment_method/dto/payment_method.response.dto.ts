import {Expose} from "class-transformer";

export class Payment_methodResponseDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    code: string;

    @Expose()
    isActive: boolean;
}