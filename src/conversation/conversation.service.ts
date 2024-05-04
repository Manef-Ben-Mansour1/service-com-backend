import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ConversationEntity } from './entities/conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';
import { MessageService } from '../message/message.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,
  ) {}

  async getConversationById(id: number): Promise<ConversationEntity> {
    const conv = await this.conversationRepository.findOne({ where: { id } });
    if (!conv) {
      throw new NotFoundException(`conversation with id ${id} not found`);
    }
    return conv;
  }
  async create(
    createConversationDto: CreateConversationDto,
  ): Promise<ConversationEntity> {
    if (createConversationDto.user1Id == createConversationDto.user2Id) {
      throw new ForbiddenException(
        "you can't create a conversation with the same user",
      );
    }
    const conversation = new ConversationEntity();
    conversation.user1 = await this.userService.findOne(
      createConversationDto.user1Id,
    );
    conversation.user2 = await this.userService.findOne(
      createConversationDto.user2Id,
    );
    return this.conversationRepository.save(conversation);
  }

  async findAll(): Promise<ConversationEntity[]> {
    return await this.conversationRepository.find();
  }

  // async remove(id: number): Promise<void> {
  //   const conv = await this.conversationRepository.findOne({ where: { id } });
  //   if (!conv) {
  //     throw new NotFoundException(`conversation with id ${id} not found`);
  //   }
  //   await this.conversationRepository.delete(id);
  // }

  async softDelete(id: number): Promise<void> {
    const conv = await this.getConversationById(+id);
    const messagesAssociated =
      await this.messageService.getMessagesByConversationId(+id);
    for (const message of messagesAssociated) {
      await this.messageService.softDelete(message.id);
    }
    await this.conversationRepository.softDelete(id);
  }

  async getConversationByUsers(
    sender: UserEntity,
    recipient: UserEntity,
  ): Promise<ConversationEntity> {
    let conv = await this.conversationRepository.findOne({
      relations: {
        user1: true,
        user2: true,
      },
      where: {
        user1: {
          id: sender.id,
        },
        user2: {
          id: recipient.id,
        },
      },
    });

    console.log(conv);
    if (!conv) {
      conv = await this.conversationRepository.findOne({
        relations: {
          user1: true,
          user2: true,
        },
        where: {
          user1: {
            id: recipient.id,
          },
          user2: {
            id: sender.id,
          },
        },
      });
    }
    console.log(conv);

    if (!conv) {
      const createConversationDto = new CreateConversationDto();
      createConversationDto.user1Id = sender.id;
      createConversationDto.user2Id = recipient.id;

      return await this.create(createConversationDto);
    }
    return await conv;
  }
}
