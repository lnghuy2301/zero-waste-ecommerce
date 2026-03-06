import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PromotionRepository } from './promotion.repository';
import { PromotionHelper } from './promotion.helper';
import { PromotionRequestDto } from './dto/promotion.request.dto';
import { PromotionResponseDto } from './dto/promotion.response.dto';
import { DeleteListPromotionDto } from './dto/delete-list-promotion.dto';

@Injectable()
export class PromotionService {
  constructor(
    private promotionRepository: PromotionRepository,
    private promotionHelper: PromotionHelper,
  ) {}

  async create(dto: PromotionRequestDto): Promise<PromotionResponseDto> {
    return this.promotionRepository.createPromotion(dto);
  }

  async update(
    id: number,
    dto: PromotionRequestDto,
  ): Promise<PromotionResponseDto> {
    await this.promotionHelper.checkPromotion(id);
    return this.promotionRepository.updatePromotion(id, dto);
  }

  async getById(id: number): Promise<PromotionResponseDto | null> {
    const promotion = await this.promotionRepository.getPromotionById(id);
    if (!promotion) {
      throw new NotFoundException('Khuyến mãi không tồn tại');
    }
    return promotion;
  }

  async getAll(): Promise<PromotionResponseDto[]> {
    const promotions = await this.promotionRepository.getAllPromotions();
    if (promotions.length === 0) {
      throw new BadRequestException('Không có khuyến mãi nào tồn tại');
    }
    return promotions;
  }

  async delete(id: number): Promise<PromotionResponseDto | null> {
    await this.promotionHelper.checkPromotion(id);
    return this.promotionRepository.deletePromotion(id);
  }

  async deleteList(dto: DeleteListPromotionDto): Promise<{ count: number }> {
    const result = await this.promotionRepository.deleteListPromotions(dto);
    if (result.count === 0) {
      throw new NotFoundException('Không tìm thấy khuyến mãi nào để xóa');
    }
    return result;
  }
}
