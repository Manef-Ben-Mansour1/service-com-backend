import { Module } from '@nestjs/common';
import { ProfessionController } from './profession.controller';
import { ProfessionService } from './profession.service';
import { ProfessionEntity } from './entities/profession.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { OrderServiceEntity } from '../order-service/entities/order-service.entity';
import { ServiceEntity } from '../service/entities/service.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ProfessionEntity,UserEntity,CategoryEntity,UserEntity,OrderEntity,OrderServiceEntity,ServiceEntity])],
  controllers: [ProfessionController],
  providers: [ProfessionService],
})
export class ProfessionModule {}
