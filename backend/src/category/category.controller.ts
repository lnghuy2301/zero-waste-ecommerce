import {
  Body,
  Controller,
  Delete,
  Get,
  //   Injectable,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryRequestDto } from './dto/category.request.dto';
import { CategoryResponseDto } from './dto/category.response.dto';
import { Delete_list_categoryDto } from './dto/delete_list_category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(
    @Body() category: CategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.createCategory(category);
  }

  @Put(':id/category')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() category: CategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.updateCategory(id, category);
  }

  @Get()
  async getCategory(): Promise<CategoryResponseDto[]> {
    return this.categoryService.getAllCategories();
  }

  @Delete(':id/category')
  async deleteCategory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CategoryResponseDto | null> {
    return this.categoryService.deleteCategory(id);
  }

  @Delete()
  async deleteListCategories(
    @Body() listCategory: Delete_list_categoryDto,
  ): Promise<{ count: number }> {
    return this.categoryService.deleteListCategories(listCategory);
  }
}
