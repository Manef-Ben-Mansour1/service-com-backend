import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderEntity } from './entities/order.entity';
import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { UserRole } from 'src/decorators/userRole.decorator';
import { UserRoleEnum } from 'src/user/enum/userRole.enum';
import { Roles } from 'src/decorators/roles.metadata';
import { RolesGuard } from 'src/user/guards/role.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @Body() order: CreateOrderDto,
    @User() user,
  ): Promise<OrderEntity> {
    return this.orderService.createOrder(order, user);
  }

  @Patch('/confirm/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.SERVICE_PROVIDER)
  async confirmOrder(
    @Param('id', ParseIntPipe) id: number,
    @User() user,
  ): Promise<OrderEntity> {
    return this.orderService.confirmOrder(id, user);
  }

  @Patch('/finish/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.SERVICE_PROVIDER)
  async finishOrder(
    @Param('id', ParseIntPipe) id: number,
    @User() user,
  ): Promise<OrderEntity> {
    return this.orderService.finishOrder(id, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getOrdersByUser(@User() user): Promise<OrderEntity[]> {
    return this.orderService.getOrdersByUser(user);
  }

  @Get('/service/:serviceId')
  @UseGuards(JwtAuthGuard)
  async getOrdersByService(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @User() user,
  ): Promise<OrderEntity[]> {
    return this.orderService.getOrdersByServiceId(serviceId, user);
  }
  
  @Get('/s-provider/')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.SERVICE_PROVIDER)
  async getOrdersByServiceProvider(@User() user): Promise<OrderEntity[]> {
    return this.orderService.getOrdersByServiceProvider(user);
  }

  @Get('/:id')
  async getOrderById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrderEntity> {
    return this.orderService.getOrderById(id);
  }
}
