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
import { ServiceEntity } from '../../service/entities/service.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@Entity('order')
@ObjectType()
export class OrderEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID) // Exposing id field
  id: number;

  @Column({
    nullable: false,
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.EN_ATTENTE,
  })
  @Field(() => OrderStatusEnum) // Exposing status field
  status: OrderStatusEnum;

  @Column({
    type: Date,
    nullable: false,
  })
  @Field() // Exposing date field
  date: Date;

  @ManyToOne(() => UserEntity, (user) => user.orders, {
    eager: true,
    nullable: false,
  })
  @Field(() => UserEntity) // Exposing user field
  user: UserEntity;

  @ManyToOne(() => ServiceEntity, (service) => service.orders, {
    eager: true,
    nullable: false,
  })
  @Field(() => ServiceEntity) // Exposing service field
  service: ServiceEntity;
}
