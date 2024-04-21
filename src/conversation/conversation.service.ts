import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ConversationEntity } from './entities/conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    private  readonly userService: UserService
  ) {}

  async getConversationById(id: number): Promise<ConversationEntity> {
    const conv = await this.conversationRepository.findOne({ where: { id } });
    if (!conv) {
      throw new NotFoundException(`conversation with id ${id} not found`);
    }
    return conv;
  }
  async create(createConversationDto: CreateConversationDto) : Promise<ConversationEntity> {
    if(createConversationDto.user1Id==createConversationDto.user2Id)
      {
        throw new  ForbiddenException("you can't create a conversation with the same user");
      
      }
    const  conversation = new ConversationEntity();
    conversation.user1= await this.userService.getUserById(createConversationDto.user1Id);
    conversation.user2= await this.userService.getUserById(createConversationDto.user2Id);
    return this.conversationRepository.save(conversation);
}

  async findAll(): Promise<ConversationEntity[]>
  {
    return await this.conversationRepository.find();
  }

async remove(id: number): Promise<void> {
  const conv = await this.conversationRepository.findOne({ where: { id } });
  if (!conv) {
    throw new NotFoundException(`conversation with id ${id} not found`);
  }
  await this.conversationRepository.delete(id);
}

  async softDelete(id: number): Promise<void> {
    const conv = await this.conversationRepository.findOne({ where: { id } });
    if (!conv) {
      throw new NotFoundException(`conversation with id ${id} not found`);
    }
    await this.conversationRepository.softDelete(id);
  }

  async getConversationByUsers(sender: UserEntity, recipient:UserEntity): Promise<ConversationEntity> {
    let conv = await this.conversationRepository.findOne({ where: { user1:sender ,user2:recipient} });
    
    if (!conv) {
conv =await this.conversationRepository.findOne({ where: { user1:recipient ,user2:sender} });
    }
    if(!conv){
   const  createConversationDto = new CreateConversationDto();
   createConversationDto.user1Id=sender.id;
   createConversationDto.user2Id=recipient.id;

    return await  this.create(createConversationDto);
    }
    return  await conv;
  }}
