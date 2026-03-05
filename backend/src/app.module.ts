import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';

// Thêm các module cần thiết
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { PromotionModule } from './promotion/promotion.module';
import { GreenCertificateModule } from './green-certificate/green-certificate.module';
import { CustomerProfileModule } from './customer_profile/customer_profile.module';
import { ProductVariantModule } from './product-variant/product-variant.module';
import { CartModule } from './cart/cart.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AccountModule,
    CategoryModule,
    ProductModule,
    CustomerProfileModule,
    PromotionModule,
    GreenCertificateModule,
    ProductVariantModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
