import { Controller, Sse, UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, filter, fromEvent, map } from 'rxjs';
import { User } from 'src/decorators/user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { NotificationEntity } from './entities/notification.entity';

@Controller('notification')
export class NotificationController {
  constructor(private eventEmitter: EventEmitter2) {}

  @Sse('sse')
  @UseGuards(JwtAuthGuard)
  sse(@User() user: UserEntity): Observable<any> {
    console.log('SSE connection established for user:', user);

    return fromEvent(this.eventEmitter, 'notification.created').pipe(
      filter((payload: NotificationEntity) => {
        const shouldEmit =
          user.id === payload.receiver.id || user.role === 'ADMIN';
        console.log('Filtering payload for user:', shouldEmit, payload);
        return shouldEmit;
      }),
      map((payload: any) => {
        console.log('Emitting payload:', payload);
        return {
          data: JSON.stringify({
            notificationTitle: payload.title,
            notificationDescription: payload.description,
            emitter: payload.emitter.firstName + ' ' + payload.emitter.lastName,
            date: payload.createdAt,
          }),
        };
      }),
    );
  }
}
