import { Controller, Sse, UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map } from 'rxjs';
import { User } from 'src/decorators/user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';

@Controller('notification')
export class NotificationController {
  constructor(private eventEmitter: EventEmitter2) {}

  
  @Sse('sse')
  @UseGuards(JwtAuthGuard)
  sse(
    @User() user : UserEntity
  ): Observable<any> {
    return fromEvent(this.eventEmitter, 'notification.created').pipe(
      map((payload : any) => {
        console.log({ payload });
        if(payload.user.id !== user.id){
            return;
          }
          console.log({ payload });
          return { data: payload };
      }),
    );
  }
}