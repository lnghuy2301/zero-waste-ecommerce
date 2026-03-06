import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';
import {Type} from "class-transformer";

export class CommentRequestDto {
    @IsNotEmpty()
    @IsString()
    content: string

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    rating: number

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    accountId: number

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    productId: number

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    parentId: number | null;
}