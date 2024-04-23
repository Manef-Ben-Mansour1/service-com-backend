import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { ServiceEntity } from 'src/service/entities/service.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatusEnum } from './enums/order-status.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
  ) {}

  async createOrder(order: CreateOrderDto, user): Promise<OrderEntity> {
    const newOrder = this.orderRepository.create(order);
    newOrder.user = user;
    newOrder.status = OrderStatusEnum.EN_ATTENTE;
    newOrder.service = await this.serviceRepository.findOne({
      where: { id: order.serviceId },
    });
    return this.orderRepository.save(newOrder);
  }
}
