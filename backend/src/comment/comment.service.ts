import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';

import { CommentRequestDto } from './dto/comment.request.dto';
import { CommentResponseDto } from './dto/comment.response.dto';
import {PrismaService} from "../../prisma/prisma.service";
import {CommentHelper} from "./comment.helper";

@Injectable()
export class CommentService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly commentHelper: CommentHelper,
    ) {}

    async create(commentRequestDto: CommentRequestDto): Promise<CommentResponseDto> {
        const hasPurchased = await this.commentHelper.checkPurchaseHistory(commentRequestDto.accountId, commentRequestDto.productId);

        if (!hasPurchased) {
            throw new ForbiddenException(
                'Bạn chỉ có thể đánh giá sản phẩm đã mua và đơn hàng đã hoàn thành.',
            );
        }

        if (commentRequestDto.parentId) {
            const parentComment = await this.prisma.comment.findUnique({
                where: { id: commentRequestDto.parentId },
            });
            if (!parentComment) {
                throw new NotFoundException('Không tìm thấy bình luận cha để trả lời.');
            }
            // Optional: Kiểm tra xem parentComment có thuộc productId này không để tránh logic sai
            if (parentComment.productId !== commentRequestDto.productId) {
                throw new ForbiddenException('Bình luận cha không thuộc sản phẩm này.');
            }
        }

        return this.prisma.comment.create({
            data: {
                content: commentRequestDto.content,
                rating: commentRequestDto.rating,
                productId: commentRequestDto.productId,
                accountId: commentRequestDto.accountId,
                parentId: commentRequestDto.parentId,
            },
        });
    }

    findAll(filterDto: CommentResponseDto) {
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