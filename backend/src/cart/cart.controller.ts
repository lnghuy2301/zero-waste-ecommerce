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
  Req,
  ForbiddenException,
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
  async create(
    @Body() dto: CartRequestDto,
    @Req() req: any,
  ): Promise<CartResponseDto> {
    const userId = req.user.id;
    return this.cartService.create(dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CartRequestDto,
    @Req() req: any,
  ): Promise<CartResponseDto> {
    const userId = req.user.id;
    return this.cartService.update(id, dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:accountId')
  async getByUser(
    @Param('accountId', ParseIntPipe) accountId: number,
    @Req() req: any,
  ): Promise<CartResponseDto[]> {
    const userId = req.user.id;
    if (userId !== accountId) {
      throw new ForbiddenException('Không được xem giỏ hàng của người khác');
    }
    return this.cartService.getByUser(accountId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<CartResponseDto | null> {
    const userId = req.user.id;
    return this.cartService.getById(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<CartResponseDto | null> {
    const userId = req.user.id;
    return this.cartService.delete(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteList(
    @Body() dto: DeleteListCartDto,
    @Req() req: any,
  ): Promise<{ count: number }> {
    const userId = req.user.id;
    return this.cartService.deleteList(dto, userId);
  }
}
