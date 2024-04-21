import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { ConversationEntity } from '../../conversation/entities/conversation.entity';
import { TimestampEntity } from 'src/generics/timestamp.entity';

@Entity('message')
export class MessageEntity extends TimestampEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sender_id' })
    sender: UserEntity;
  
    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'recipient_id' })
    recipient: UserEntity;
  
    @ManyToOne(() => ConversationEntity, conversation => conversation.messages, { onDelete: 'CASCADE', eager: true, nullable: false })
    conversation: ConversationEntity;
  
    @Column()
    text: string;
}
