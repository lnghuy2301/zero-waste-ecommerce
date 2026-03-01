import {ArrayNotEmpty, IsArray, IsIn, IsInt, IsNotEmpty} from "class-validator";
import {Type} from "class-transformer";

export class List_accountRequestDto{
    @ArrayNotEmpty()
    @IsArray()
    @Type(() => Number)
    @IsInt({each: true})
    Ids: number[];
}