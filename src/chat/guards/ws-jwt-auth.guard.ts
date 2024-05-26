import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    try {
      const authHeader = client.handshake.headers.authorization;
      if (!authHeader) throw new WsException('No auth token');

      const token = authHeader.split(' ')[1];
      const payload = this.jwtService.verify(token, {
        secret: process.env.SECRET,
      });

      client.data.user = payload; // Attach the user payload to the socket instance for future use

      return true;
    } catch (e) {
      throw new WsException('Invalid credentials');
    }
  }
}
