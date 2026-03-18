import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Nội dung bình luận',
    example: 'Sản phẩm rất tốt!',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Đánh giá (1-5)', example: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    description: 'ID của bình luận cha (nếu là trả lời bình luận khác)',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  parentId?: number;
}
