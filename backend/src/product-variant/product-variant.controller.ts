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
import { ProductVariantService } from './product-variant.service';
import { ProductVariantRequestDto } from './dto/product-variant.request.dto';
import { ProductVariantResponseDto } from './dto/product-variant.response.dto';
import { DeleteListProductVariantDto } from './dto/delete-list-product-variant.dto';
import { JwtAuthGuard } from '../auth/auth.jwt.guard';

@Controller('product-variant')
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createVariant(
    @Body() dto: ProductVariantRequestDto,
  ): Promise<ProductVariantResponseDto> {
    return this.productVariantService.createVariant(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateVariant(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProductVariantRequestDto,
  ): Promise<ProductVariantResponseDto> {
    return this.productVariantService.updateVariant(id, dto);
  }

  @Get(':id')
  async getVariantById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductVariantResponseDto | null> {
    return this.productVariantService.getVariantById(id);
  }

  @Get()
  async getAllVariants(): Promise<ProductVariantResponseDto[]> {
    return this.productVariantService.getAllVariants();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteVariant(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductVariantResponseDto | null> {
    return this.productVariantService.deleteVariant(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteListVariants(
    @Body() dto: DeleteListProductVariantDto,
  ): Promise<{ count: number }> {
    return this.productVariantService.deleteListVariants(dto);
  }
}
