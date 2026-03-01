import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module'; // ← thêm dòng này

@Module({
  imports: [
    // Load biến môi trường từ file .env và biến thành global để module nào cũng dùng được
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule, // ← thêm vào imports
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
