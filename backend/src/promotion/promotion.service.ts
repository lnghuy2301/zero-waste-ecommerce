import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PromotionRepository } from './promotion.repository';
import { PromotionHelper } from './promotion.helper';
import { PromotionRequestDto } from './dto/promotion.request.dto';
import { PromotionResponseDto } from './dto/promotion.response.dto';
import { DeleteListPromotionDto } from './dto/list_promotion_delete.dto';
import { AccountHelper } from '../account/account.helper';

@Injectable()
export class PromotionService {
  constructor(
    private promotionRepository: PromotionRepository,
    private promotionHelper: PromotionHelper,
    private accountHelper: AccountHelper,
  ) {}

  async createPromotion(
    dto: PromotionRequestDto,
  ): Promise<PromotionResponseDto> {
    try {
      return await this.promotionRepository.createPromotion(dto);
    } catch (error) {
      this.accountHelper.handleError(error);
    }
  }

  async updatePromotion(
    id: number,
    dto: PromotionRequestDto,
  ): Promise<PromotionResponseDto> {
    try {
      await this.promotionHelper.checkPromotion(id);
      return await this.promotionRepository.updatePromotion(id, dto);
    } catch (error) {
      this.accountHelper.handleError(error);
    }
  }

  async getPromotionById(id: number): Promise<PromotionResponseDto | null> {
    try {
      const promotion = await this.promotionRepository.getPromotionById(id);
      if (!promotion) {
        throw new NotFoundException('Khuyến mãi không tồn tại');
      }
      return promotion;
    } catch (error) {
      this.accountHelper.handleError(error);
    }
  }

  async getAllPromotions(): Promise<PromotionResponseDto[]> {
    try {
      const promotions = await this.promotionRepository.getAllPromotions();
      if (promotions.length === 0) {
        throw new BadRequestException('Không có khuyến mãi nào tồn tại');
      }
      return promotions;
    } catch (error) {
      this.accountHelper.handleError(error);
    }
  }

  async deletePromotion(id: number): Promise<PromotionResponseDto | null> {
    try {
      await this.promotionHelper.checkPromotion(id);
      return await this.promotionRepository.deletePromotion(id);
    } catch (error) {
      this.accountHelper.handleError(error);
    }
  }

  async deleteListPromotions(
    dto: DeleteListPromotionDto,
  ): Promise<{ count: number }> {
    try {
      const result = await this.promotionRepository.deleteListPromotions(dto);
      if (result.count === 0) {
        throw new NotFoundException('Không tìm thấy khuyến mãi nào để xóa');
      }
      return result;
    } catch (error) {
      this.accountHelper.handleError(error);
    }
  }
}
