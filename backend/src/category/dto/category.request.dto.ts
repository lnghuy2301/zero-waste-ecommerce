import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CategoryRequestDto {
    @IsNotEmpty({message: 'Tên danh mục không được bỏ trống'})
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string | null;
}