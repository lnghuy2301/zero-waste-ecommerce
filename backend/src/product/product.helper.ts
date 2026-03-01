import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductResponseDto } from './dto/product.response.dto';

@Injectable()
export class ProductHelper {
  constructor(private prismaService: PrismaService) {}

  async checkProduct(id: number): Promise<ProductResponseDto> {
    const product = await this.prismaService.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    return product;
  }
}
