import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryHelper } from './category.helper';
import { CategoryRepository } from './category.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [AccountModule],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CategoryRepository,
    CategoryHelper,
    PrismaService,
  ],
  exports: [CategoryService, CategoryRepository, CategoryHelper],
})
export class CategoryModule {}
