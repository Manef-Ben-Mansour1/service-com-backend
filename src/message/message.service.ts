import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageEntity } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { ConversationService } from 'src/conversation/conversation.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => ConversationService))
    private readonly conversationService: ConversationService,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<MessageEntity> {
    const message = new MessageEntity();
    message.text = createMessageDto.text;
    message.sender = await this.userService.findOne(createMessageDto.senderId);
    message.recipient = await this.userService.findOne(
      createMessageDto.recipientId,
    );
    const conversation = await this.conversationService.getConversationByUsers(
      message.sender,
      message.recipient,
    );

    message.conversation = conversation;
    return this.messageRepository.save(message);
  }

  async findAll(): Promise<MessageEntity[]> {
    return await this.messageRepository.find();
  }

  async findOne(id: number): Promise<MessageEntity> {
    const message = await this.messageRepository.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException(`message with id ${id} not found`);
    }
    return message;
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const existingMessage = await this.findOne(+id);
    if (!existingMessage) {
      throw new NotFoundException(`Le CV d'id ${id} n'existe pas`);
    }

    if (updateMessageDto.text !== undefined) {
      existingMessage.text = updateMessageDto.text;
    }

    const updatedMessage = await this.messageRepository.save(existingMessage);

    return updatedMessage;
  }

  async softDelete(id: number): Promise<void> {
    const message = await this.findOne(+id);
    await this.messageRepository.softDelete(id);
  }

  async getMessagesByConversationId(id: number): Promise<MessageEntity[]> {
    const messages = await this.messageRepository.find({
      relations: {
        conversation: true,
      },
      where: {
        conversation: {
          id: id,
        },
      },
    });
    return await messages;
  }
}
