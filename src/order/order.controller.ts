import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderEntity } from './entities/order.entity';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }
    @Post()
    async createOrder( @Body() order: CreateOrderDto, user): Promise<OrderEntity>{
        return this.orderService.createOrder(order, user);
    }
}
