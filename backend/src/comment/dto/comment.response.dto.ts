import { Expose, Type } from 'class-transformer';

export class CommentResponseDto {
  @Expose()
  id: number;

  @Expose()
  content: string;

  @Expose()
  rating: number;

  @Expose()
  createdAt: Date;

  @Expose()
  account: {
    id: number;
    email: string;
    fullName?: string; // từ profile nếu có
  };

  @Expose()
  product: {
    id: number;
    name: string;
  };

  @Expose()
  @Type(() => Object)
  media?: any[];
}
