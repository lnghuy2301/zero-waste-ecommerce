import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartRepository } from './cart.repository';
import { CartHelper } from './cart.helper';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [CartController],
  providers: [CartService, CartRepository, CartHelper, PrismaService],
  exports: [CartService, CartRepository, CartHelper],
})
export class CartModule {}
