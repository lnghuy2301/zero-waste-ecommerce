import { Expose, Type } from 'class-transformer';

export class CommentAdminResponseDto {
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
    fullName?: string;
  };

  @Expose()
  product: {
    id: number;
    name: string;
  };
}
