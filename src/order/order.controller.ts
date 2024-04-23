import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderEntity } from './entities/order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post()
  async createOrder(@Body() order: CreateOrderDto, user): Promise<OrderEntity> {
    return this.orderService.createOrder(order, user);
  }
  @Patch('/confirm/:id')
  async confirmOrder(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrderEntity> {
    return this.orderService.confirmOrder(id);
  }
  @Get('/user')
  async getOrdersByUser(user): Promise<OrderEntity[]> {
    return this.orderService.getOrdersByUser(user);
  }
    @Get('/service/:serviceId')
    async getOrdersByService(@Param('serviceId', ParseIntPipe) serviceId: number): Promise<OrderEntity[]> {
      return this.orderService.getOrdersByServiceId(serviceId);
    }
}
