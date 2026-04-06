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
        productId: productId ? Number(productId) : undefined,
        accountId: accountId ? Number(accountId) : undefined,
        isHidden: false,
      },
      include: {
        account: {
          select: {
            id: true,
            email: true,
            avatar: true,
            profile: {
              select: {
                fullName: true,
              },
            },
          },
        },
        product: {
          select: { id: true, name: true, slug: true },
        },
        media: true,
      },
    });
  }

  async toggleVisibility(id: number, isHidden: boolean) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Không tìm thấy bình luận này.');
    }

    return this.prisma.comment.update({
      where: { id },
      data: { isHidden },
    });
  }
}
