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

  // Relation to the user who emits/sends the notification
  @ManyToOne(() => UserEntity, (user) => user.sentNotifications, {
    eager: true,
    nullable: false,
  })
  emitter: UserEntity;

  // Relation to the user who receives the notification
  @ManyToOne(() => UserEntity, (user) => user.receivedNotifications, {
    eager: true,
    nullable: true,
  })
  receiver: UserEntity;
}