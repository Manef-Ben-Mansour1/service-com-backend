import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { MessageEntity } from '../../message/entities/message.entity';
import { TimestampEntity } from 'src/generics/timestamp.entity';

@Entity('conversation')
export class ConversationEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  user1: UserEntity;

  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  user2: UserEntity;

  @OneToMany(() => MessageEntity, message => message.conversation, { cascade: true, onDelete: 'CASCADE' })
  messages: MessageEntity[];
}
