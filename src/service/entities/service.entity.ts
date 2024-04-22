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

@Entity('service')
export class ServiceEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column()
  imagePath: string;

  @Column({ nullable: false })
  basePrice: number;

  @ManyToOne(() => ProfessionEntity, (profession) => profession.services, {
    eager: true,
    nullable: false,
  })
  profession: ProfessionEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.service, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: CommentEntity[];

  @OneToMany(() => RatingEntity, (rating) => rating.service, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ratings: CommentEntity[];
}
