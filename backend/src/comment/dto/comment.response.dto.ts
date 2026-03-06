import { ApiPropertyOptional } from '@nestjs/swagger';
import {Expose, Type} from 'class-transformer';
import {IsInt, IsNotEmpty, IsOptional, IsString, Min} from 'class-validator';

export class CommentResponseDto {
    @Expose()
    id: number;

    @Expose()
    content: string

    @Expose()
    rating: number

    @Expose()
    accountId: number

    @Expose()
    productId: number

    @Expose()
    parentId: number | null;
}