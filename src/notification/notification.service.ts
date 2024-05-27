import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { Repository } from 'typeorm';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { OrderEntity } from 'src/order/entities/order.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('order.created')
  handleOrderCreatedOrder(order: OrderEntity) {
    const notification = new NotificationEntity();
    notification.receiver = order.service.profession.user;
    notification.emitter = order.user;
    notification.title = 'New order created';
    notification.description = `A new order of ${order.service.title} has been created.`;
    this.notificationRepository.save(notification);
    this.eventEmitter.emit('notification', notification);
  }
  @OnEvent('order.confirmed')
  handleOrderConfirmedEvent(order: OrderEntity) {
    const notification = new NotificationEntity();
    notification.emitter = order.service.profession.user;
    notification.receiver = order.user;
    notification.title = 'Order confirmed';
    notification.description = `The order of ${order.service.title} has been confirmed by ${order.service.profession.user.firstName} ${order.service.profession.user.lastName} .`;
    this.notificationRepository.save(notification);
    this.eventEmitter.emit('notification', notification);
  }
  @OnEvent('order.finished')
  handleOrderFinishedEvent(order: OrderEntity) {
    const notification = new NotificationEntity();
    notification.emitter = order.service.profession.user;
    notification.title = 'Order finished';
    notification.description = `The order  ${order.id} is finished .`;
    this.notificationRepository.save(notification);
    this.eventEmitter.emit('notification', notification);
  }
}
