import {ArrayNotEmpty, IsArray, IsInt} from "class-validator";
import {Type} from "class-transformer";

export class List_payment_methodRequestDto {
    @ArrayNotEmpty({message: ''})
    @IsArray()
    @Type(() => Number)
    @IsInt({each: true})
    Ids: number[];
}