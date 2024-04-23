// category.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryEntity } from './entities/category.entity';
import { ProfessionEntity } from '../profession/entities/profession.entity';
import { ServiceEntity } from '../service/entities/service.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { OrderServiceEntity } from '../order-service/entities/order-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity,ProfessionEntity,ServiceEntity,OrderEntity,OrderServiceEntity])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
