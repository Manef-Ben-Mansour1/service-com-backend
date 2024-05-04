import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageEntity } from '../message/entities/message.entity';
import { CreateMessageDto } from '../message/dto/create-message.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { MessageService } from '../message/message.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway {
  constructor(private readonly messageService: MessageService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('connect')
  handleConnection(@ConnectedSocket() client: Socket): string {
    console.log('connected');
    client.join('3');
    console.log('connected');

    return 'connected';
  }

  @SubscribeMessage('allMessages')
  async getAllMessages(
    @ConnectedSocket() client: Socket,
  ): Promise<MessageEntity[]> {
    let messages = await this.messageService.findAll();
    for (const item of messages) {
      console.log(item.text);
    }
    return this.messageService.findAll();
  }

  @SubscribeMessage('addMessage')
  async addMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ): Promise<MessageEntity> {
    const createMessageDto: CreateMessageDto = JSON.parse(data);
    console.log(createMessageDto.recipientId);
    console.log(createMessageDto.senderId);

    const newMessage = await this.messageService.create(createMessageDto);
    this.server
      .to(createMessageDto.recipientId.toString())
      .emit('message', newMessage);
    return newMessage;
  }
}
