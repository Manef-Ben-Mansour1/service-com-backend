import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server } from "socket.io";
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { WsJwtGuard } from 'src/comment/guards/ws-jwt/ws-jwt.guard';
import { UseGuards } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SocketAuthMiddleware } from 'src/comment/ws.mw';
import { JwtService } from '@nestjs/jwt';
import { CreateCommentDto } from '../comment/dto/create-comment.dto';
import { CommentService } from '../comment/comment.service';
import { UserService } from 'src/user/user.service';
import * as cookie from 'cookie';

@WebSocketGateway({ 
  cors:{
    origin:'*',
},
  namespace: 'events' })
//@UseGuards(WsJwtGuard)
export class EventsGateway implements OnGatewayConnection , OnGatewayDisconnect {
  constructor(
    private jwtService :JwtService,
    private userService: UserService,
    private CommentService :CommentService,

  ){}
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
          console.log('User connected:', userId);
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
      user    );
    
    this.server.emit('newComment', newComment);
    return newComment;
  }
}