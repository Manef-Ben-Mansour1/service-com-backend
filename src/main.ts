import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  ExcludeTimestampInterceptor
} from './interceptors/exclude-timestamp-interceptor/exclude-timestamp-interceptor.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist:true}));
  app.useGlobalInterceptors(new ExcludeTimestampInterceptor());
  app.enableCors({
    origin: 'http://localhost:3001', // Allow only the frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Optional: Specify the allowed HTTP methods
    credentials: true, // Optional: Enable credentials for CORS
  });
  await app.listen(3000);
  }
bootstrap();
