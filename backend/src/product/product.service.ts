import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { ProductHelper } from './product.helper';
import { ProductRequestDto } from './dto/product.request.dto';
import { ProductResponseDto } from './dto/product.response.dto';
import { DeleteListProductDto } from './dto/list_product_delete.dto';
import { AccountHelper } from '../account/account.helper';

@Injectable()
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private productHelper: ProductHelper,
    private accountHelper: AccountHelper,
  ) {}

  async createProduct(dto: ProductRequestDto): Promise<ProductResponseDto> {
    try {
      return await this.productRepository.createProduct(dto);
    } catch (error) {
      this.accountHelper.handleError(error);
    }
  }

  async updateProduct(
    id: number,
    dto: ProductRequestDto,
  ): Promise<ProductResponseDto> {
    try {
      await this.productHelper.checkProduct(id);
      return await this.productRepository.updateProduct(id, dto);
    } catch (error) {
      this.accountHelper.handleError(error);
    }
  }

  async getProductById(id: number): Promise<ProductResponseDto | null> {
    try {
      const product = await this.productRepository.getProductById(id);
      if (!product) {
        throw new NotFoundException('Sản phẩm không tồn tại');
      }
      return product;
    } catch (error) {
      this.accountHelper.handleError(error);
    }
  }

  async getAllProducts(): Promise<ProductResponseDto[]> {
    try {
      const products = await this.productRepository.getAllProducts();
      if (products.length === 0) {
        throw new BadRequestException('Không có sản phẩm nào tồn tại');
      }
      return products;
    } catch (error) {
      this.accountHelper.handleError(error);
    }
  }

  async deleteProduct(id: number): Promise<ProductResponseDto | null> {
    try {
      await this.productHelper.checkProduct(id);
      return await this.productRepository.deleteProduct(id);
    } catch (error) {
      this.accountHelper.handleError(error);
    }
  }

  async deleteListProducts(
    dto: DeleteListProductDto,
  ): Promise<{ count: number }> {
    try {
      const result = await this.productRepository.deleteListProducts(dto);
      if (result.count === 0) {
        throw new NotFoundException('Không tìm thấy sản phẩm nào để xóa');
      }
      return result;
    } catch (error) {
      this.accountHelper.handleError(error);
    }
  }
}
