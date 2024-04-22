import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { OrderServiceEntity } from '../../order-service/entities/order-service.entity';
import { TimestampEntity } from '../../generics/timestamp.entity';

@Entity('order')
export class OrderEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  finalPrice: number;

  @ManyToOne(() => UserEntity, (user) => user.orders, {
    eager: true,
    nullable: false,
  })
  user: UserEntity;

  @OneToMany(() => OrderServiceEntity, (orderService) => orderService.order, {

  })
  orderServices: OrderServiceEntity[];
}
