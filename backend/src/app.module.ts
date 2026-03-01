// import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { PrismaModule } from '../prisma/prisma.module'; // ← thêm dòng này

// @Module({
//   imports: [
//     // Load biến môi trường từ file .env và biến thành global để module nào cũng dùng được
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),
//     PrismaModule, // ← thêm vào imports
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
