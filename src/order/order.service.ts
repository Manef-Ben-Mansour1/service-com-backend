import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatusEnum } from './enums/order-status.enum';
import { ServiceService } from '../service/service.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly serviceService: ServiceService,
    private eventEmitter: EventEmitter2
  ) {}

  async createOrder(order: CreateOrderDto, user): Promise<OrderEntity> {
    const service = await this.serviceService.getServiceById(order.serviceId);
    if (!service) {
      throw new BadRequestException('Service not found');
    }
    if (service.profession.user.id === user.id) {
      throw new BadRequestException('You cannot order your own service');
    }
    const newOrder = this.orderRepository.create(order);
    newOrder.user = user;
    newOrder.status = OrderStatusEnum.EN_ATTENTE;
    newOrder.service = service;
    const savedOrder = this.orderRepository.save(newOrder);
    this.eventEmitter.emit('order.created', newOrder);
    return savedOrder;
  }
  async confirmOrder(id: number, user): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (order.status !== OrderStatusEnum.EN_ATTENTE) {
      throw new BadRequestException('Order is not pending');
    }
    if (order.service.profession.user.id !== user.id) {
      throw new BadRequestException(
        'You are not authorized to confirm this order',
      );
    }
    order.status = OrderStatusEnum.CONFIRME;
    const savedOrder = this.orderRepository.save(order);
    this.eventEmitter.emit('order.confirmed', order);
    return savedOrder;
  }
  async finishOrder(id: number, user): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (order.service.profession.user.id !== user.id) {
      throw new BadRequestException(
        'You are not authorized to confirm this order',
      );
    }
    if (order.status !== OrderStatusEnum.CONFIRME) {
      throw new BadRequestException('Order is not confirmed yet');
    }
    order.status = OrderStatusEnum.FINIE;
    const savedOrder = this.orderRepository.save(order);
    this.eventEmitter.emit('order.finished', order);
    return savedOrder;
  }

  async getOrdersByUser(user): Promise<OrderEntity[]> {
    return this.orderRepository.find({
      where: { user: { id: user.id } },
      relations: ['service'],
    });
  }
  async getOrdersByServiceId(serviceId: number, user): Promise<OrderEntity[]> {
    return this.orderRepository.find({
      where: { service: { id: serviceId } },
      relations: ['user'],
    });
  }
  async getOrdersByServiceProvider(user): Promise<OrderEntity[]> {
    if (!user.profession) {
      throw new BadRequestException('You are not a service provider');
    }
    return this.orderRepository.find({
      where: { service: { profession: { user: { id: user.id } } } },
      relations: ['user', 'service'],
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
