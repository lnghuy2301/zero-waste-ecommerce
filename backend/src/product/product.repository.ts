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
        soLuongDaBan: data.soLuongDaBan ?? 0,
        danhGiaTrungBinh: data.danhGiaTrungBinh ?? 0,
        soLuongDanhGia: data.soLuongDanhGia ?? 0,
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
        soLuongDaBan: data.soLuongDaBan,
        danhGiaTrungBinh: data.danhGiaTrungBinh,
        soLuongDanhGia: data.soLuongDanhGia,
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
    return this.prismaService.$transaction(async (prisma) => {
      // 1. Xóa giỏ hàng liên quan đến biến thể của sản phẩm
      await prisma.cart.deleteMany({
        where: {
          variant: {
            productId: { in: dto.Ids },
          },
        },
      });

      // 2. Xóa chi tiết đơn hàng liên quan đến biến thể
      await prisma.orderDetail.deleteMany({
        where: {
          variant: {
            productId: { in: dto.Ids },
          },
        },
      });

      // 3. Xóa biến thể của sản phẩm
      await prisma.productVariant.deleteMany({
        where: {
          productId: { in: dto.Ids },
        },
      });

      // 4. Xóa sản phẩm
      const result = await prisma.product.deleteMany({
        where: { id: { in: dto.Ids } },
      });

      return { count: result.count };
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
