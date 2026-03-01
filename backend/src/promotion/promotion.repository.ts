import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PromotionRequestDto } from './dto/promotion.request.dto';
import { PromotionResponseDto } from './dto/promotion.response.dto';
import { DeleteListPromotionDto } from './dto/list_promotion_delete.dto';
import { plainToInstance } from 'class-transformer';
import { Prisma } from '@prisma/client';

@Injectable()
export class PromotionRepository {
  constructor(private prismaService: PrismaService) {}

  async createPromotion(
    data: PromotionRequestDto,
  ): Promise<PromotionResponseDto> {
    console.log(
      'Incoming discountValue:',
      data.discountValue,
      typeof data.discountValue,
    );
    const decimalValue = new Prisma.Decimal(String(data.discountValue));
    console.log('Parsed Decimal:', decimalValue.toString());

    const created = await this.prismaService.promotion.create({
      data: {
        code: data.code,
        name: data.name,
        discountType: data.discountType,
        discountValue: decimalValue,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: data.isActive ?? true,
      },
    });
    return plainToInstance(PromotionResponseDto, created);
  }

  async updatePromotion(
    id: number,
    data: PromotionRequestDto,
  ): Promise<PromotionResponseDto> {
    const updated = await this.prismaService.promotion.update({
      where: { id },
      data: {
        code: data.code,
        name: data.name,
        discountType: data.discountType,
        discountValue: new Prisma.Decimal(String(data.discountValue)),
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: data.isActive,
      },
    });
    return plainToInstance(PromotionResponseDto, updated);
  }

  async getPromotionById(id: number): Promise<PromotionResponseDto | null> {
    const promotion = await this.prismaService.promotion.findUnique({
      where: { id },
    });
    return promotion ? plainToInstance(PromotionResponseDto, promotion) : null;
  }

  async getAllPromotions(): Promise<PromotionResponseDto[]> {
    const promotions = await this.prismaService.promotion.findMany();
    return plainToInstance(PromotionResponseDto, promotions);
  }

  async deletePromotion(id: number): Promise<PromotionResponseDto | null> {
    const deleted = await this.prismaService.promotion.delete({
      where: { id },
    });
    return plainToInstance(PromotionResponseDto, deleted);
  }

  async deleteListPromotions(
    dto: DeleteListPromotionDto,
  ): Promise<{ count: number }> {
    const result = await this.prismaService.promotion.deleteMany({
      where: { id: { in: dto.Ids } },
    });
    return { count: result.count };
  }
}
