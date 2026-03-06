import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PromotionRequestDto } from './dto/promotion.request.dto';
import { PromotionResponseDto } from './dto/promotion.response.dto';
import { DeleteListPromotionDto } from './dto/delete-list-promotion.dto';
import { plainToInstance } from 'class-transformer';
import { Prisma } from '@prisma/client';

@Injectable()
export class PromotionRepository {
  constructor(private prismaService: PrismaService) {}

  async createPromotion(
    data: PromotionRequestDto,
  ): Promise<PromotionResponseDto> {
    const decimalValue = new Prisma.Decimal(data.discountValue);

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

    return plainToInstance(PromotionResponseDto, {
      ...created,
      discountValue: Number(created.discountValue),
    });
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
        discountValue: new Prisma.Decimal(data.discountValue),
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: data.isActive,
      },
    });

    return plainToInstance(PromotionResponseDto, {
      ...updated,
      discountValue: Number(updated.discountValue),
    });
  }

  async getPromotionById(id: number): Promise<PromotionResponseDto | null> {
    const promotion = await this.prismaService.promotion.findUnique({
      where: { id },
    });

    if (!promotion) return null;

    return plainToInstance(PromotionResponseDto, {
      ...promotion,
      discountValue: Number(promotion.discountValue),
    });
  }

  async getAllPromotions(): Promise<PromotionResponseDto[]> {
    const promotions = await this.prismaService.promotion.findMany();

    return promotions.map((p) =>
      plainToInstance(PromotionResponseDto, {
        ...p,
        discountValue: Number(p.discountValue),
      }),
    );
  }

  async deletePromotion(id: number): Promise<PromotionResponseDto | null> {
    const deleted = await this.prismaService.promotion.delete({
      where: { id },
    });

    return plainToInstance(PromotionResponseDto, {
      ...deleted,
      discountValue: Number(deleted.discountValue),
    });
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
