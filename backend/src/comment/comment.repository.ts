import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CommentAdminResponseDto } from './dto/comment.admin.response.dto';
import { plainToInstance } from 'class-transformer';
import { DeleteListCommentDto } from './dto/delete-list-comment.dto';
@Injectable()
export class CommentRepository {
  constructor(private prisma: PrismaService) {}

  // Admin lấy tất cả bình luận
  async getAllForAdmin() {
    const comments = await this.prisma.comment.findMany({
      include: {
        account: {
          select: {
            id: true,
            email: true,
            profile: { select: { fullName: true } },
          },
        },
        product: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return plainToInstance(CommentAdminResponseDto, comments);
  }

  // Xóa bình luận
  async deleteComment(id: number) {
    return this.prisma.comment.delete({
      where: { id },
    });
  }

  // Các hàm cũ nếu bạn cần giữ (tùy chọn)
  async findAll(filter: any) {
    // ... code cũ của bạn nếu có
  }
  // Xóa nhiều bình luận (Admin)
  async deleteManyComments(dto: DeleteListCommentDto) {
    const result = await this.prisma.comment.deleteMany({
      where: { id: { in: dto.Ids } },
    });
    return { count: result.count };
  }
}
