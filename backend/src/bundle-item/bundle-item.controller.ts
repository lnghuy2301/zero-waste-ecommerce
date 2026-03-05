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
import { BundleItemService } from './bundle-item.service';
import { BundleItemRequestDto } from './dto/bundle-item.request.dto';
import { BundleItemResponseDto } from './dto/bundle-item.response.dto';
import { DeleteListBundleItemDto } from './dto/delete-list-bundle-item.dto';
import { JwtAuthGuard } from '../auth/auth.jwt.guard';

@Controller('bundle-item')
export class BundleItemController {
  constructor(private readonly bundleItemService: BundleItemService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBundleItem(
    @Body() dto: BundleItemRequestDto,
  ): Promise<BundleItemResponseDto> {
    return this.bundleItemService.createBundleItem(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateBundleItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: BundleItemRequestDto,
  ): Promise<BundleItemResponseDto> {
    return this.bundleItemService.updateBundleItem(id, dto);
  }

  @Get(':id')
  async getBundleItemById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BundleItemResponseDto | null> {
    return this.bundleItemService.getBundleItemById(id);
  }

  @Get()
  async getAllBundleItems(): Promise<BundleItemResponseDto[]> {
    return this.bundleItemService.getAllBundleItems();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteBundleItem(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BundleItemResponseDto | null> {
    return this.bundleItemService.deleteBundleItem(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteListBundleItems(
    @Body() dto: DeleteListBundleItemDto,
  ): Promise<{ count: number }> {
    return this.bundleItemService.deleteListBundleItems(dto);
  }
}
