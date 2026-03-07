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
import { CategoryService } from './category.service';
import { CategoryRequestDto } from './dto/category.request.dto';
import { CategoryResponseDto } from './dto/category.response.dto';
import { Delete_list_categoryDto } from './dto/delete_list_category.dto';
import { JwtAuthGuard } from '../auth/auth.jwt.guard';
import { RolesGuard } from '../auth/auth.role.guard';
import { Roles } from '../auth/auth.role.decorator';
import { Role } from '@prisma/client';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(
    @Body() category: CategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.create(category);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id/category')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() category: CategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.update(id, category);
  }

  @Get()
  async getCategory(): Promise<CategoryResponseDto[]> {
    return this.categoryService.getAllCategories();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id/category')
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CategoryResponseDto | null> {
    return this.categoryService.delete(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete()
  async deleteListCategories(
    @Body() listCategory: Delete_list_categoryDto,
  ): Promise<{ count: number }> {
    return this.categoryService.deleteList(listCategory);
  }
}
