// category.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryEntity } from './entities/category.entity';
import { ProfessionEntity } from '../profession/entities/profession.entity';
import { ServiceEntity } from '../service/entities/service.entity';


@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity,ProfessionEntity,ServiceEntity])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
