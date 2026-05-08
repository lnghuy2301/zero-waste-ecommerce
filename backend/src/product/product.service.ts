import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { ProductHelper } from './product.helper';
import { ProductRequestDto } from './dto/product.request.dto';
import { ProductResponseDto } from './dto/product.response.dto';
import { DeleteListProductDto } from './dto/list_product_delete.dto';
import { Express } from 'express';

@Injectable()
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private productHelper: ProductHelper,
  ) {}

  async createProduct(dto: ProductRequestDto): Promise<ProductResponseDto> {
    return this.productRepository.createProduct(dto);
  }

  async updateProduct(
    id: number,
    dto: ProductRequestDto,
  ): Promise<ProductResponseDto> {
    await this.productHelper.checkProduct(id);
    return this.productRepository.updateProduct(id, dto);
  }

  async getProductById(id: number): Promise<ProductResponseDto | null> {
    const product = await this.productRepository.getProductById(id);
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }
    return product;
  }

  async getAllProducts(
    search?: string,
    categoryId?: number,
    minPrice?: number,
    maxPrice?: number,
    material?: string,
    greenCertId?: number,
    minEco?: number,
    minRating?: number,
    sort?: string,
  ): Promise<ProductResponseDto[]> {
    return this.productRepository.getAllProducts(
      search,
      categoryId,
      minPrice,
      maxPrice,
      material,
      greenCertId,
      minEco,
      minRating,
      sort,
    );
  }
  async deleteProduct(id: number): Promise<ProductResponseDto | null> {
    await this.productHelper.checkProduct(id);
    return this.productRepository.deleteProduct(id);
  }

  async deleteListProducts(
    dto: DeleteListProductDto,
  ): Promise<{ count: number }> {
    const result = await this.productRepository.deleteListProducts(dto);
    if (result.count === 0) {
      throw new NotFoundException('Không tìm thấy sản phẩm nào để xóa');
    }
    return result;
  }

  async uploadMainImage(id: number, file: Express.Multer.File) {
    await this.productHelper.checkProduct(id);
    return this.productRepository.uploadMainImage(id, file);
  }
  async getProductCount(): Promise<number> {
    const products = await this.productRepository.getAllProducts();
    return products.length;
  }
  async getTotalInventory(): Promise<number> {
    return this.productRepository.getTotalInventory();
  }

  async getTotalSold(): Promise<number> {
    return this.productRepository.getTotalSold();
  }
  async getSoldVariantsDetails() {
    return this.productRepository.getSoldVariantsDetails();
  }

  async getSoldProductsDetails() {
    return this.productRepository.getSoldProductsDetails();
  }
}
