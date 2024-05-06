import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  ExcludeTimestampInterceptor
} from './interceptors/exclude-timestamp-interceptor/exclude-timestamp-interceptor.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors:true});
  app.useGlobalPipes(new ValidationPipe({whitelist:true}));
  app.useGlobalInterceptors(new ExcludeTimestampInterceptor())
  await app.listen(3000);
}
bootstrap();
