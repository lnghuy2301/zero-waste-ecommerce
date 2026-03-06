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

    if (createCommentDto.parentId) {
      const parent = await this.prisma.comment.findUnique({
        where: { id: createCommentDto.parentId },
      });
      if (!parent) throw new NotFoundException('Không tìm thấy bình luận cha.');
      if (parent.productId !== productId) {
        throw new ForbiddenException('Bình luận cha không thuộc sản phẩm này.');
      }
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
          some: {
            variant: {
              productId: productId,
            },
          },
        },
      },
    });

    return !!order;
  }

  async findAll(filterDto: GetCommentsFilterDto) {
    const { productId, accountId } = filterDto;

    return this.prisma.comment.findMany({
      where: {
        productId,
        accountId,
      },
      include: {
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
