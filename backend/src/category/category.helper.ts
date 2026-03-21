import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoryResponseDto } from './dto/category.response.dto';

@Injectable()
export class CategoryHelper {
  constructor(private prismaService: PrismaService) {}

  async checkCategory(id: number): Promise<CategoryResponseDto> {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Danh mục không tồn tại');
    }

    return category;
  }
}
