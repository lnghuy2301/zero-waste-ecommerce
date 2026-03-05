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
import { CartService } from './cart.service';
import { CartRequestDto } from './dto/cart.request.dto';
import { CartResponseDto } from './dto/cart.response.dto';
import { DeleteListCartDto } from './dto/delete-list-cart.dto';
import { JwtAuthGuard } from '../auth/auth.jwt.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async addToCart(@Body() dto: CartRequestDto): Promise<CartResponseDto> {
    return this.cartService.addToCart(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateCartItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CartRequestDto,
  ): Promise<CartResponseDto> {
    return this.cartService.updateCartItem(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:accountId')
  async getCartByUser(
    @Param('accountId', ParseIntPipe) accountId: number,
  ): Promise<CartResponseDto[]> {
    return this.cartService.getCartByUser(accountId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getCartItemById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CartResponseDto | null> {
    return this.cartService.getCartItemById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeCartItem(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CartResponseDto | null> {
    return this.cartService.removeCartItem(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async clearCartItems(
    @Body() dto: DeleteListCartDto,
  ): Promise<{ count: number }> {
    return this.cartService.clearCartItems(dto);
  }
}
