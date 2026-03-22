import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoryRequestDto } from './dto/category.request.dto';
import { CategoryResponseDto } from './dto/category.response.dto';
import { Delete_list_categoryDto } from './dto/delete_list_category.dto';
import { Express } from 'express';

@Injectable()
export class CategoryRepository {
  constructor(private prismaService: PrismaService) {}

  async createCategory(
    category: CategoryRequestDto,
    imagePath?: string,
  ): Promise<CategoryResponseDto> {
    return this.prismaService.category.create({
      data: {
        name: category.name,
        description: category.description,
        ...(imagePath && { image: imagePath }),
      },
    });
  }

  async updateCategory(
    id: number,
    category: CategoryRequestDto,
    imagePath?: string,
  ): Promise<CategoryResponseDto> {
    const updateData: any = {
      name: category.name,
      description: category.description,
    };
    if (imagePath) {
      updateData.image = imagePath;
    }

    return this.prismaService.category.update({
      where: { id },
      data: updateData,
    });
  }

  async getAllCategories(): Promise<CategoryResponseDto[]> {
    return this.prismaService.category.findMany();
  }

  async deleteCategory(id: number): Promise<CategoryResponseDto | null> {
    return this.prismaService.category.delete({
      where: { id },
    });
  }

  async deleteListCategory(
    listCategory: Delete_list_categoryDto,
  ): Promise<{ count: number }> {
    return this.prismaService.category.deleteMany({
      where: {
        id: { in: listCategory.Ids },
      },
    });
  }

  // HÀM UPLOAD ẢNH RIÊNG
  async uploadImage(
    id: number,
    file: Express.Multer.File,
  ): Promise<CategoryResponseDto> {
    return this.prismaService.category.update({
      where: { id },
      data: {
        image: `/uploads/${file.filename}`,
      },
    });
  }
}
