import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import {verify} from 'jsonwebtoken';

@Injectable()
export class WsJwtGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client: Socket =context.switchToWs().getClient<Socket>();
    console.log("client");
    if (context.getType()!=='ws')
      {return true;}
    WsJwtGuard.validateToken(client);
    return true;

  }
  static validateToken(client : Socket){
    const authorization= client.handshake.headers.authorization;
    console.log({authorization});
    const token : string = authorization.split(' ')[1];
    const payload = verify(token,'nbvghjkjnhjkjn');
    return payload;
  }
}
