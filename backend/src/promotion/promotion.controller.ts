import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionRequestDto } from './dto/promotion.request.dto';
import { PromotionResponseDto } from './dto/promotion.response.dto';
import { DeleteListPromotionDto } from './dto/list_promotion_delete.dto';
import { JwtAuthGuard } from '../auth/auth.jwt.guard';

@Controller('promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPromotion(
    @Body() dto: PromotionRequestDto,
  ): Promise<PromotionResponseDto> {
    return this.promotionService.createPromotion(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updatePromotion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PromotionRequestDto,
  ): Promise<PromotionResponseDto> {
    return this.promotionService.updatePromotion(id, dto);
  }

  @Get(':id')
  async getPromotionById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PromotionResponseDto | null> {
    return this.promotionService.getPromotionById(id);
  }

  @Get()
  async getAllPromotions(): Promise<PromotionResponseDto[]> {
    return this.promotionService.getAllPromotions();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePromotion(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PromotionResponseDto | null> {
    return this.promotionService.deletePromotion(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteListPromotions(
    @Body() dto: DeleteListPromotionDto,
  ): Promise<{ count: number }> {
    return this.promotionService.deleteListPromotions(dto);
  }
}
