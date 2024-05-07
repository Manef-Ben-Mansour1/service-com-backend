import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderEntity } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceModule } from 'src/service/service.module';
import { ServiceEntity } from 'src/service/entities/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity,ServiceEntity]), ServiceModule], 
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
