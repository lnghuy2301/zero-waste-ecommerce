import { Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { CartHelper } from './cart.helper';
import { CartRequestDto } from './dto/cart.request.dto';
import { CartResponseDto } from './dto/cart.response.dto';
import { DeleteListCartDto } from './dto/delete-list-cart.dto';

@Injectable()
export class CartService {
  constructor(
    private cartRepository: CartRepository,
    private cartHelper: CartHelper,
  ) {}

  async addToCart(dto: CartRequestDto): Promise<CartResponseDto> {
    // Có thể thêm check variant tồn tại, stock đủ ở đây nếu cần sau
    return this.cartRepository.addToCart(dto);
  }

  async updateCartItem(
    id: number,
    dto: CartRequestDto,
  ): Promise<CartResponseDto> {
    await this.cartHelper.checkCartItem(id);
    return this.cartRepository.updateCartItem(id, dto);
  }

  async getCartByUser(accountId: number): Promise<CartResponseDto[]> {
    const items = await this.cartRepository.getCartByUser(accountId);
    if (items.length === 0) {
      throw new NotFoundException('Giỏ hàng trống');
    }
    return items;
  }

  async getCartItemById(id: number): Promise<CartResponseDto | null> {
    const item = await this.cartRepository.getCartItemById(id);
    if (!item) {
      throw new NotFoundException('Mặt hàng không tồn tại trong giỏ');
    }
    return item;
  }

  async removeCartItem(id: number): Promise<CartResponseDto | null> {
    await this.cartHelper.checkCartItem(id);
    return this.cartRepository.removeCartItem(id);
  }

  async clearCartItems(dto: DeleteListCartDto): Promise<{ count: number }> {
    const result = await this.cartRepository.clearCartItems(dto);
    if (result.count === 0) {
      throw new NotFoundException('Không có mặt hàng nào để xóa');
    }
    return result;
  }
}
