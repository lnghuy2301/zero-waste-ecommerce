import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Cấu hình Prefix cho API (VD: http://localhost:3000/api/v1/products)
  app.setGlobalPrefix('api/v1');

  // ấu hình CORS (Cho phép Frontend gọi vào)
  app.enableCors({
    origin: true, // Trong môi trường Dev cho phép tất cả, Prod sẽ giới hạn domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Cấu hình Validation Pipe (Kiểm soát dữ liệu đầu vào)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các field không được khai báo trong DTO
      forbidNonWhitelisted: true, // Báo lỗi nếu gửi lên field thừa
      transform: true, // Tự động chuyển đổi kiểu dữ liệu (VD: string '1' -> number 1)
    }),
  );

  // Cấu hình Swagger (Tài liệu API tự động)
  const config = new DocumentBuilder()
    .setTitle('Zero Waste E-commerce API')
    .setDescription('API documentation for Zero Waste Project')
    .setVersion('1.0')
    .addBearerAuth() // Hỗ trợ xác thực JWT trong Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Cấu hình để serve file tĩnh từ thư mục 'uploads'
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // 5. Khởi chạy server
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger Docs is running on: ${await app.getUrl()}/api/docs`);
}
bootstrap();
