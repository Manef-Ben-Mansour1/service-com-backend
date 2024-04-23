import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatusEnum } from './enums/order-status.enum';
import { ServiceService } from '../service/service.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly serviceService: ServiceService,
  ) {}

  async createOrder(order: CreateOrderDto, user): Promise<OrderEntity> {
    const newOrder = this.orderRepository.create(order);
    newOrder.user = user;
    newOrder.status = OrderStatusEnum.EN_ATTENTE;
    newOrder.service = await this.serviceService.getServiceById(
      order.serviceId,
    );
    return this.orderRepository.save(newOrder);
  }
  async confirmOrder(id: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({ where: { id } });
    order.status = OrderStatusEnum.CONFIRME;
    return this.orderRepository.save(order);
  }
  async finishOrder(id: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (order.status !== OrderStatusEnum.CONFIRME) {
      throw new BadRequestException('Order is not confirmed yet');
    }
    order.status = OrderStatusEnum.FINIE;
    return this.orderRepository.save(order);
  }
  async getOrdersByUser(user): Promise<OrderEntity[]> {
    return this.orderRepository.find({
      where: { user },
      relations: ['service'],
    });
  }
  async getOrdersByServiceId(serviceId: number): Promise<OrderEntity[]> {
    return this.orderRepository.find({
      where: { service: { id: serviceId } },
      relations: ['user'],
    });
  }
  async getOrderById(id: number): Promise<OrderEntity> {
    const order = this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'service'],
    });
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    return order;
  }
}
