import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentsFilterDto } from './dto/get-comments-filter.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number, // ID lấy từ JWT
    productId: number,
    createCommentDto: CreateCommentDto,
  ) {
    // 1. Kiểm tra xem User đã mua sản phẩm này chưa (Trạng thái COMPLETED)
    const hasPurchased = await this.checkPurchaseHistory(userId, productId);

    if (!hasPurchased) {
      throw new ForbiddenException(
        'Bạn chỉ có thể đánh giá sản phẩm đã mua và đơn hàng đã hoàn thành.',
      );
    }

    // 2. Kiểm tra Parent Comment (nếu có)
    if (createCommentDto.parentId) {
      const parentComment = await this.prisma.comment.findUnique({
        where: { id: createCommentDto.parentId },
      });
      if (!parentComment) {
        throw new NotFoundException('Không tìm thấy bình luận cha để trả lời.');
      }
      // Optional: Kiểm tra xem parentComment có thuộc productId này không để tránh logic sai
      if (parentComment.productId !== productId) {
        throw new ForbiddenException('Bình luận cha không thuộc sản phẩm này.');
      }
    }

    // 3. Tạo bình luận vào Database
    return this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        rating: createCommentDto.rating,
        productId: productId,
        accountId: userId, // Link với tài khoản đang đăng nhập
        parentId: createCommentDto.parentId,
      },
    });
  }

  // Hàm phụ: Kiểm tra lịch sử mua hàng
  private async checkPurchaseHistory(
    userId: number,
    productId: number,
  ): Promise<boolean> {
    // Tìm xem có đơn hàng nào thỏa mãn 3 điều kiện:
    // 1. Của user này
    // 2. Trạng thái COMPLETED
    // 3. Chứa sản phẩm này (thông qua Variant)
    const order = await this.prisma.order.findFirst({
      where: {
        accountId: userId,
        status: OrderStatus.COMPLETED,
        orderItems: {
          some: {
            variant: {
              productId: productId,
            },
          },
        },
      },
    });

    return !!order; // Trả về true nếu tìm thấy, false nếu không
  }

  findAll(filterDto: GetCommentsFilterDto) {
    const { productId, accountId } = filterDto;

    return this.prisma.comment.findMany({
      where: {
        productId,
        accountId,
      },
      include: {
        // Lấy thông tin người bình luận và sản phẩm được bình luận
        account: {
          select: { id: true, email: true },
        },
        product: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
