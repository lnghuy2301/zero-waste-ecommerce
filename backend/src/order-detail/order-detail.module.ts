import { Module } from '@nestjs/common';
import { OrderDetailController } from './order-detail.controller';
import { OrderDetailService } from './order-detail.service';
import { OrderDetailRepository } from './order-detail.repository';
import { OrderDetailHelper } from './order-detail.helper';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [OrderDetailController],
  providers: [
    OrderDetailService,
    OrderDetailRepository,
    OrderDetailHelper,
    PrismaService,
  ],
  exports: [OrderDetailService, OrderDetailRepository, OrderDetailHelper],
})
export class OrderDetailModule {}
