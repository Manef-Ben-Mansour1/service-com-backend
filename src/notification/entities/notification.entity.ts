import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { TimestampEntity } from '../../generics/timestamp.entity';

@Entity('notification')
export class NotificationEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.orders, {
    eager: true,
    nullable: false,
  })
  user: UserEntity;
}
