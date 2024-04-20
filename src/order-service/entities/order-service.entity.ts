import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from '../../order/entities/order.entity';
import { ServiceEntity } from '../../service/entities/service.entity';
import { TimestampEntity } from '../../generics/timestamp.entity';

@Entity('order-service')
export class OrderServiceEntity extends TimestampEntity{

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderEntity, order => order.orderServices,{eager:true,nullable:false})
  order: OrderEntity;

  @ManyToOne(()=>ServiceEntity, service => service.orderServices,{eager:true,nullable:false})
  service: ServiceEntity;

}