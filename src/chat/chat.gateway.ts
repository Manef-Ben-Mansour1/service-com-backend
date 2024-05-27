import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageEntity } from '../message/entities/message.entity';
import { CreateMessageDto } from '../message/dto/create-message.dto';
import { UserEntity } from '../user/entities/user.entity';
import { MessageService } from '../message/message.service';
import { ConversationService } from '../conversation/conversation.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Logger, UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from './guards/ws-jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import * as cookie from 'cookie';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001',
    credentials: true,
  },
})
//@UseGuards(WsJwtAuthGuard)
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    try {
      const cookies = cookie.parse(client.handshake.headers.cookie || '');
      const token = cookies['jwtToken']; // Use the name of your cookie
      if (token) {
        const decoded = this.jwtService.verify(token, {
          secret: process.env.SECRET,
        });

        if (decoded) {
          const userId = decoded.id;
          client.data.user = userId;
          // Optionally join the user to a room corresponding to their userId (for private messaging)
          client.join(userId.toString()); // Make sure userId is converted to string
          client.to(userId.toString()).emit('id', userId);
          console.log('id emited');
        } else {
          client.disconnect();
        }
      } else {
        client.disconnect();
      }
    } catch (error) {
      console.error('Invalid token:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
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

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(room); // Le client rejoint la room
  }

  @SubscribeMessage('addMessage')
  async addMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateMessageDto,
  ): Promise<MessageEntity> {
    console.log(client.data.user);

    const recipient = await this.userService.findOne(data.recipientId);
    console.log(data, client.data.user);
    const newMessage = await this.messageService.create(data, client.data.user);
    client.emit('id', client.data.user);
    client.to(recipient.id.toString()).emit(`message`, newMessage);
    client.emit('id', client.data.user);
    return newMessage;
  }

  @SubscribeMessage('getMessages')
  async getMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ): Promise<MessageEntity[]> {
    // Retrieve messages from the database
    const messages =
      await this.messageService.getMessagesByConversationId(+conversationId);
    console.log(conversationId);
    // Send the messages to the client
    client.emit('messageHistory', messages);
    client.emit('id', client.data.user);
    return messages;
  }

  @SubscribeMessage('getCurrentUser')
  getUserId(@ConnectedSocket() client: Socket): void {
    client.emit('id', client.data.user);
  }
}
