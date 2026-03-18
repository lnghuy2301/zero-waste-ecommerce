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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryRequestDto } from './dto/category.request.dto';
import { CategoryResponseDto } from './dto/category.response.dto';
import { Delete_list_categoryDto } from './dto/delete_list_category.dto';
import { JwtAuthGuard } from '../auth/auth.jwt.guard';
import { RolesGuard } from '../auth/auth.role.guard';
import { Roles } from '../auth/auth.role.decorator';
import { Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, multerStorage } from '../media/config/multer.config'; // import từ media
import type { Express } from 'express';
// import type { Multer } from 'multer';

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

  // THÊM UPLOAD HÌNH ẢNH CHO DANH MỤC
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post(':id/image')
  @UseInterceptors(
    FileInterceptor('image', { storage: multerStorage, fileFilter }),
  )
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoryService.uploadImage(id, file);
  }
}
