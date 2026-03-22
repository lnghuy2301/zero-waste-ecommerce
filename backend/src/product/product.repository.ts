// product.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductRequestDto } from './dto/product.request.dto';
import { ProductResponseDto } from './dto/product.response.dto';
import { DeleteListProductDto } from './dto/list_product_delete.dto';

@Injectable()
export class ProductRepository {
  constructor(private prismaService: PrismaService) {}

  async createProduct(data: ProductRequestDto): Promise<ProductResponseDto> {
    return this.prismaService.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId,
        type: data.type ?? 'RETAIL',
        status: data.status ?? 'ACTIVE',
        description: data.description,
        material: data.material,
        ecoFriendliness: data.ecoFriendliness,
        reusability: data.reusability,
        mainImage: data.mainImage ?? null,
        soLuongDaBan: data.soLuongDaBan ?? 0, // Thêm trường
      },
      include: { category: true },
    });
  }

  async updateProduct(
    id: number,
    data: ProductRequestDto,
  ): Promise<ProductResponseDto> {
    return this.prismaService.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId,
        type: data.type,
        status: data.status,
        description: data.description,
        material: data.material,
        ecoFriendliness: data.ecoFriendliness,
        reusability: data.reusability,
        mainImage: data.mainImage,
        soLuongDaBan: data.soLuongDaBan, // Thêm trường (có thể update)
      },
      include: { category: true },
    });
  }

  async getProductById(id: number): Promise<ProductResponseDto | null> {
    return this.prismaService.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async getAllProducts(categoryId?: number): Promise<ProductResponseDto[]> {
    const where = categoryId ? { categoryId } : {};
    return this.prismaService.product.findMany({
      where,
      include: { category: true },
    });
  }

  async deleteProduct(id: number): Promise<ProductResponseDto | null> {
    return this.prismaService.product.delete({
      where: { id },
      include: { category: true },
    });
  }

  async deleteListProducts(
    dto: DeleteListProductDto,
  ): Promise<{ count: number }> {
    return this.prismaService.product.deleteMany({
      where: {
        id: { in: dto.Ids },
      },
    });
  }

  async uploadMainImage(id: number, file: Express.Multer.File) {
    const updated = await this.prismaService.product.update({
      where: { id },
      data: {
        mainImage: `/uploads/${file.filename}`,
      },
      include: { category: true },
    });

    return updated;
  }
}
