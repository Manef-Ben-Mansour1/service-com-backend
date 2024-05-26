import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ExcludeTimestampInterceptor } from './interceptors/exclude-timestamp-interceptor/exclude-timestamp-interceptor.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with specific origin and credentials
  app.enableCors({
    origin: ['http://localhost:3001'], // Specify allowed origin(s)
    credentials: true, // Allow cookies to be sent
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ExcludeTimestampInterceptor());
  app.use(cookieParser());


  await app.listen(3000);
  }
bootstrap();
