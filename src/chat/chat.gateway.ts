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
@WebSocketGateway({
  cors: {
    origin: '*',
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
      const authHeader = client.handshake.headers.authorization;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        const decoded = this.jwtService.verify(token, {
          secret: process.env.SECRET,
        });

        if (decoded) {
          const userId = decoded.id;
          client.data.user = userId;

          // Optionally join the user to a room corresponding to their userId (for private messaging)
          client.join(userId.toString()); // Make sure userId is converted to string
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
    // Here you can clean up any resources or perform any necessary actions on user disconnect
    console.log(`Client disconnected: ${client.id}`);
    // If you had stored any specific user information in client.data, it would be accessible here
    // For example: const userId = client.data.user;
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
    @MessageBody() data: string,
  ): Promise<MessageEntity> {
    const createMessageDto: CreateMessageDto = JSON.parse(data);

    const recipient = await this.userService.findOne(
      createMessageDto.recipientId,
    );
    const sender = await this.userService.findOne(createMessageDto.senderId);

    const newMessage = await this.messageService.create(createMessageDto);
    // const conv = await this.conversationService.getConversationByUsers(
    //   sender,
    //   recipient,
    // );
    // const convID = conv.id;
    // console.log(convID);
    // client.join(convID.toString());
    client.to(recipient.id.toString()).emit(`message`, newMessage);
    console.log(client.rooms);
    return newMessage;
  }
}
