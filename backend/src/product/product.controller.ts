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
import { ProductService } from './product.service';
import { ProductRequestDto } from './dto/product.request.dto';
import { ProductResponseDto } from './dto/product.response.dto';
import { DeleteListProductDto } from './dto/list_product_delete.dto';
import { JwtAuthGuard } from '../auth/auth.jwt.guard';
import { RolesGuard } from '../auth/auth.role.guard';
import { Roles } from '../auth/auth.role.decorator';
import { Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, multerStorage } from '../media/config/multer.config';
import { Express } from 'express';
import type { Multer } from 'multer';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async createProduct(
    @Body() dto: ProductRequestDto,
  ): Promise<ProductResponseDto> {
    return this.productService.createProduct(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductResponseDto | null> {
    return this.productService.deleteProduct(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete()
  async deleteListProducts(
    @Body() dto: DeleteListProductDto,
  ): Promise<{ count: number }> {
    return this.productService.deleteListProducts(dto);
  }

  // THÊM UPLOAD MAIN IMAGE CHO SẢN PHẨM
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post(':id/image')
  @UseInterceptors(
    FileInterceptor('image', { storage: multerStorage, fileFilter }),
  )
  async uploadMainImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productService.uploadMainImage(id, file);
  }
}
