import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageEntity } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { ConversationService } from 'src/conversation/conversation.service';
import { measureMemory } from 'vm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private  readonly messageRepository: Repository<MessageEntity>,
    private  readonly userService: UserService,
    private readonly conversationService : ConversationService
  ){
  }

 async create(createMessageDto: CreateMessageDto): Promise<MessageEntity> {
    const message = new MessageEntity();
    message.text =  createMessageDto.text;
    message.sender = await this.userService.getUserById(createMessageDto.senderId);
    message.recipient = await this.userService.getUserById(createMessageDto.recipientId);
    const conversation = await this.conversationService.getConversationByUsers(message.sender,message.recipient);
    message.conversation=conversation;
    return this.messageRepository.save(message);
  }

  async findAll(): Promise<MessageEntity[]>
  {
    return await this.messageRepository.find();
  }


  findOne(id: number) {
    return `This action returns a #id message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #id message`;
  }

  remove(id: number) {
    return `This action removes a #id message`;
  }
}
