import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PromotionRepository } from './promotion.repository';
import { PromotionHelper } from './promotion.helper';
import { PromotionRequestDto } from './dto/promotion.request.dto';
import { PromotionResponseDto } from './dto/promotion.response.dto';
import { DeleteListPromotionDto } from './dto/list_promotion_delete.dto';

@Injectable()
export class PromotionService {
  constructor(
    private promotionRepository: PromotionRepository,
    private promotionHelper: PromotionHelper,
  ) {}

  async createPromotion(
    dto: PromotionRequestDto,
  ): Promise<PromotionResponseDto> {
    return this.promotionRepository.createPromotion(dto);
  }

  async updatePromotion(
    id: number,
    dto: PromotionRequestDto,
  ): Promise<PromotionResponseDto> {
    await this.promotionHelper.checkPromotion(id);
    return this.promotionRepository.updatePromotion(id, dto);
  }

  async getPromotionById(id: number): Promise<PromotionResponseDto | null> {
    const promotion = await this.promotionRepository.getPromotionById(id);
    if (!promotion) {
      throw new NotFoundException('Khuyến mãi không tồn tại');
    }
    return promotion;
  }

  async getAllPromotions(): Promise<PromotionResponseDto[]> {
    const promotions = await this.promotionRepository.getAllPromotions();
    if (promotions.length === 0) {
      throw new BadRequestException('Không có khuyến mãi nào tồn tại');
    }
    return promotions;
  }

  async deletePromotion(id: number): Promise<PromotionResponseDto | null> {
    await this.promotionHelper.checkPromotion(id);
    return this.promotionRepository.deletePromotion(id);
  }

  async deleteListPromotions(
    dto: DeleteListPromotionDto,
  ): Promise<{ count: number }> {
    const result = await this.promotionRepository.deleteListPromotions(dto);
    if (result.count === 0) {
      throw new NotFoundException('Không tìm thấy khuyến mãi nào để xóa');
    }
    return result;
  }
}
