import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentsFilterDto } from './dto/get-comments-filter.dto';
import { CommentRepository } from './comment.repository';
import { DeleteListCommentDto } from './dto/delete-list-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private prisma: PrismaService,
    private commentRepository: CommentRepository,
  ) {}

  // Tạo bình luận (người dùng)
  async create(
    userId: number,
    productId: number,
    createCommentDto: CreateCommentDto,
  ) {
    if (!userId) {
      throw new ForbiddenException('Không xác định được người dùng');
    }

    const hasPurchased = await this.checkPurchaseHistory(userId, productId);
    if (!hasPurchased) {
      throw new ForbiddenException(
        'Bạn chỉ có thể bình luận sản phẩm đã mua và đơn hàng đã hoàn thành.',
      );
    }

    return this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        rating: createCommentDto.rating,
        productId,
        accountId: userId,
        parentId: createCommentDto.parentId,
      },
    });
  }

  private async checkPurchaseHistory(
    userId: number,
    productId: number,
  ): Promise<boolean> {
    const order = await this.prisma.order.findFirst({
      where: {
        accountId: userId,
        status: OrderStatus.COMPLETED,
        orderItems: {
          some: { variant: { productId } },
        },
      },
    });
    return !!order;
  }

  // Admin lấy tất cả bình luận
  async getAllForAdmin() {
    return this.commentRepository.getAllForAdmin();
  }

  // Admin xóa bình luận
  async delete(id: number) {
    const exist = await this.prisma.comment.findUnique({ where: { id } });
    if (!exist) throw new NotFoundException('Bình luận không tồn tại');

    return this.commentRepository.deleteComment(id);
  }

  // Hàm cũ (nếu cần giữ)
  async findAll(filterDto: GetCommentsFilterDto) {
    const { productId, accountId } = filterDto;
    return this.prisma.comment.findMany({
      where: {
        productId: productId ? Number(productId) : undefined,
        accountId: accountId ? Number(accountId) : undefined,
      },
      include: {
        account: {
          select: {
            id: true,
            email: true,
            profile: { select: { fullName: true } },
          },
        },
        product: { select: { id: true, name: true } },
      },
    });
  }
  // Admin xóa nhiều bình luận
  async deleteMany(dto: DeleteListCommentDto) {
    if (!dto.Ids || dto.Ids.length === 0) {
      throw new BadRequestException('Danh sách ID không được để trống');
    }
    return this.commentRepository.deleteManyComments(dto);
  }
}
