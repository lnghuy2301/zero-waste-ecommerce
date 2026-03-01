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
import { ProductService } from './product.service';
import { ProductRequestDto } from './dto/product.request.dto';
import { ProductResponseDto } from './dto/product.response.dto';
import { DeleteListProductDto } from './dto/list_product_delete.dto';
import { JwtAuthGuard } from '../auth/auth.jwt.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard) // Có thể bỏ guard nếu cho phép public tạo sản phẩm (thường admin-only)
  @Post()
  async createProduct(
    @Body() dto: ProductRequestDto,
  ): Promise<ProductResponseDto> {
    return this.productService.createProduct(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProductRequestDto,
  ): Promise<ProductResponseDto> {
    return this.productService.updateProduct(id, dto);
  }

  @Get(':id')
  async getProductById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductResponseDto | null> {
    return this.productService.getProductById(id);
  }

  @Get()
  async getAllProducts(): Promise<ProductResponseDto[]> {
    return this.productService.getAllProducts();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductResponseDto | null> {
    return this.productService.deleteProduct(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteListProducts(
    @Body() dto: DeleteListProductDto,
  ): Promise<{ count: number }> {
    return this.productService.deleteListProducts(dto);
  }
}
