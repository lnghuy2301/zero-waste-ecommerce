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

  // --- 1. DÀNH CHO NGƯỜI DÙNG: CHỈ XEM BÌNH LUẬN ĐANG HIỆN ---
  async findAllForUser(productId: number) {
    return this.prisma.comment.findMany({
      where: {
        productId: productId ? Number(productId) : undefined,
        isHidden: false, // 🛡️ Fix cứng: User không bao giờ thấy bình luận bị ẩn
      },
      include: {
        account: {
          select: {
            id: true,
            email: true,
            avatar: true,
            profile: { select: { fullName: true } },
          },
        },
        media: true,
      },
      orderBy: { createdAt: 'desc' }, // Mới nhất lên đầu
    });
  }

  // --- 2. DÀNH CHO ADMIN: LỌC LINH HOẠT TẤT CẢ/ẨN/HIỆN ---
  async findAllForAdmin(filterDto: GetCommentsFilterDto) {
    const { productId, accountId, visibility } = filterDto;

    const whereCondition: any = {
      productId: productId ? Number(productId) : undefined,
      accountId: accountId ? Number(accountId) : undefined,
    };

    // Admin có quyền chọn xem cái nào dựa trên bộ lọc từ Frontend
    if (visibility === 'VISIBLE') {
      whereCondition.isHidden = false;
    } else if (visibility === 'HIDDEN') {
      whereCondition.isHidden = true;
    }
    // Nếu visibility là 'ALL', không thêm isHidden vào where để lấy toàn bộ

    return this.prisma.comment.findMany({
      where: whereCondition,
      include: {
        account: {
          select: {
            id: true,
            email: true,
            avatar: true,
            profile: { select: { fullName: true } },
          },
        },
        product: { select: { id: true, name: true, slug: true } },
        media: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // --- CÁC HÀM TẠO VÀ CẬP NHẬT TRẠNG THÁI ---
  async create(
    userId: number,
    productId: number,
    createCommentDto: CreateCommentDto,
  ) {
    if (!userId) throw new ForbiddenException('Không xác định được người dùng');

    const hasPurchased = await this.checkPurchaseHistory(userId, productId);
    if (!hasPurchased) {
      throw new ForbiddenException(
        'Bạn chỉ có thể bình luận sản phẩm đã mua và đơn hàng đã hoàn thành.',
      );
    }

    // Kiểm tra bình luận cha nếu có
    if (createCommentDto.parentId) {
      const parent = await this.prisma.comment.findUnique({
        where: { id: createCommentDto.parentId },
      });
      if (!parent) throw new NotFoundException('Không tìm thấy bình luận cha.');
      if (parent.productId !== productId)
        throw new ForbiddenException('Bình luận cha không thuộc sản phẩm này.');
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
        orderItems: { some: { variant: { productId: productId } } },
      },
    });
    return !!order;
  }

  async toggleVisibility(id: number, isHidden: boolean) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Không tìm thấy bình luận này.');

    return this.prisma.comment.update({
      where: { id },
      data: { isHidden },
    });
  }
}
