import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server } from "socket.io";
import { ServerToClientsEvents } from './types/events';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { WsJwtGuard } from 'src/comment/guards/ws-jwt/ws-jwt.guard';
import { UseGuards } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SocketAuthMiddleware } from 'src/comment/ws.mw';
import { JwtService } from '@nestjs/jwt';
import { CreateCommentDto } from '../comment/dto/create-comment.dto';
import { CommentService } from '../comment/comment.service';
import { UserService } from 'src/user/user.service';
@WebSocketGateway({ namespace: 'events' })
//@UseGuards(WsJwtGuard)
export class EventsGateway implements OnGatewayConnection , OnGatewayDisconnect {
  constructor(
    private jwtService :JwtService,
    private userService: UserService,
    private CommentService :CommentService,

  ){}
  @WebSocketServer()
  server: Server<ServerToClientsEvents>;
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

  @SubscribeMessage('comment')
  async addMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ): Promise<CommentEntity> {
    console.log(client.data.user);
    const createCommentDto: CreateCommentDto = JSON.parse(data);

    const user = await this.userService.findOne(
      client.data.user
    );

    const newComment = await this.CommentService.create(
      createCommentDto,
      user
    );
    
    client.emit(`newComment`, newComment);
    return newComment;
  }
}