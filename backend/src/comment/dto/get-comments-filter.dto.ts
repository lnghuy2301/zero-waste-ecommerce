import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class GetCommentsFilterDto {
    @ApiPropertyOptional({
        description: 'Lọc bình luận theo ID sản phẩm',
        example: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    productId?: number;

    @ApiPropertyOptional({
        description: 'Lọc bình luận theo ID người dùng',
        example: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    accountId?: number;
}