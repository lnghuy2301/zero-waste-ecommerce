import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api/v1');

  // Allow local origins and dynamic FRONTEND_URL environment variable for Render/Vercel deployment
  const allowedOrigins = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000']
    : true;

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Zero Waste E-commerce API')
    .setDescription('API documentation for Zero Waste Project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Serve uploads
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on port: ${port}`);
  console.log(`Swagger Docs is running on: ${await app.getUrl()}/api/docs`);
}
bootstrap();
