import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { TimestampEntity } from '../../generics/timestamp.entity';
import { OrderStatusEnum } from '../enums/order-status.enum';
import { ServiceEntity } from 'src/service/entities/service.entity';

@Entity('order')
export class OrderEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.EN_ATTENTE,
  })
  status: OrderStatusEnum;
  @Column({
    type: Date,
    nullable: false
  })
  date: Date;
  @ManyToOne(() => UserEntity, (user) => user.orders, {
    eager: true,
    nullable: false,
  })
  user: UserEntity;
  @ManyToOne(() => ServiceEntity, (service) => service.orders, {
    eager: true,
    nullable: false,
  })
  service: ServiceEntity;
}
