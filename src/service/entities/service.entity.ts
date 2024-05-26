import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampEntity } from '../../generics/timestamp.entity';
import { OrderEntity } from '../../order/entities/order.entity';
import { ProfessionEntity } from '../../profession/entities/profession.entity';
import { CommentEntity } from '../../comment/entities/comment.entity';
import { RatingEntity } from '../../rating/entities/rating.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity('service')
@ObjectType()
export class ServiceEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID) // This decorator makes the field a GraphQL ID field

  id: number;

  @Column({
    nullable: false,
  })
  @Field() 
  title: string;

  @Column({ nullable: false })
  @Field() 
  description: string;

  @Column()
  @Field() 
  imagePath: string;

  @Column({ nullable: false })
  @Field() 
  basePrice: number;

  @ManyToOne(() => ProfessionEntity, (profession) => profession.services, {
    eager: true,
    nullable: false,
  })
  @Field(() => ProfessionEntity)
  profession: ProfessionEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.service, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [CommentEntity])
  comments: CommentEntity[];

  @OneToMany(() => RatingEntity, (rating) => rating.service, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [RatingEntity])
  ratings: CommentEntity[];
  @OneToMany(()=>OrderEntity, (order)=>order.service, {
    cascade: ['soft-remove'],
    onDelete: 'CASCADE'
  })
  @Field(() => [OrderEntity])
  orders: OrderEntity[];
}
