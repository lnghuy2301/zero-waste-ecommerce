import { Module } from '@nestjs/common';
import { BundleItemController } from './bundle-item.controller';
import { BundleItemService } from './bundle-item.service';
import { BundleItemRepository } from './bundle-item.repository';
import { BundleItemHelper } from './bundle-item.helper';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [BundleItemController],
  providers: [
    BundleItemService,
    BundleItemRepository,
    BundleItemHelper,
    PrismaService,
  ],
  exports: [BundleItemService, BundleItemRepository, BundleItemHelper],
})
export class BundleItemModule {}
