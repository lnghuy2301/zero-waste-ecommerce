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
        mainImage: data.mainImage,
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

  async getAllProducts(): Promise<ProductResponseDto[]> {
    return this.prismaService.product.findMany({
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
}
