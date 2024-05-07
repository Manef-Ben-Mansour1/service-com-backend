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
  handleOrderCreatedEvent(order: OrderEntity) {
    const notification = new NotificationEntity();
    notification.user = order.service.profession.user;
    notification.title = 'New order created';
    notification.description = `A new order of ${order.service.title} has been created.`;

    this.notificationRepository.save(notification);

    this.eventEmitter.emit('notification.created', notification);
  }
}
