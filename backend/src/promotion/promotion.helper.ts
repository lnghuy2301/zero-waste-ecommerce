import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PromotionResponseDto } from './dto/promotion.response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PromotionHelper {
  constructor(private prismaService: PrismaService) {}

  async checkPromotion(id: number): Promise<PromotionResponseDto> {
    const promotion = await this.prismaService.promotion.findUnique({
      where: { id },
    });

    if (!promotion) {
      throw new NotFoundException('Khuyến mãi không tồn tại');
    }

    // Fix: check discountValue trước khi transform
    const safePromotion = {
      ...promotion,
      discountValue: promotion.discountValue
        ? Number(promotion.discountValue)
        : 0, // fallback nếu undefined
    };

    return plainToInstance(PromotionResponseDto, safePromotion);
  }
}
