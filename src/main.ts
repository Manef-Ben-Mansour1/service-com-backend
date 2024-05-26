import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ExcludeTimestampInterceptor } from './interceptors/exclude-timestamp-interceptor/exclude-timestamp-interceptor.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist:true}));
  app.useGlobalInterceptors(new ExcludeTimestampInterceptor());
  app.use(cookieParser());
  app.enableCors({
    origin: (origin, callback) => callback(null, origin), 
  });

  await app.listen(3000);
  }
bootstrap();
