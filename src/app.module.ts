import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import * as dotenv from 'dotenv';
import * as process from "node:process";
import { UserEntity } from './user/entities/user.entity';
import { TimestampEntity } from './generics/timestamp.entity';
import { CategoryModule } from './category/category.module';
import { CategoryEntity } from './category/entities/category.entity';
import { ServiceModule } from './service/service.module';
import { ServiceEntity } from './service/entities/service.entity';
import { OrderModule } from './order/order.module';
import { OrderEntity } from './order/entities/order.entity';
import { ProfessionModule } from './profession/profession.module';
import { ProfessionEntity } from './profession/entities/profession.entity';
import { CommentModule } from './comment/comment.module';
import { CommentEntity } from './comment/entities/comment.entity';
import { RatingModule } from './rating/rating.module';
import { RatingEntity } from './rating/entities/rating.entity';
import { MulterModule } from '@nestjs/platform-express';

dotenv.config();

@Module({
  imports: [MulterModule.register({
    dest: './uploads'}),
     TypeOrmModule.forRoot({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [UserEntity,CategoryEntity,ProfessionEntity,ServiceEntity,OrderEntity,CommentEntity,RatingEntity],
    synchronize: true,
  }), UserModule, CategoryModule, ServiceModule, OrderModule, ProfessionModule, CommentModule, RatingModule],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
