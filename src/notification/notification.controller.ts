import { Controller, Sse, UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, filter, fromEvent, map } from 'rxjs';
import { User } from 'src/decorators/user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { NotificationEntity } from './entities/notification.entity';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(private eventEmitter: EventEmitter2) {}

  @Sse('sse')
  @UseGuards(JwtAuthGuard)
  sse(@User() user: UserEntity): Observable<any> {
    return fromEvent(this.eventEmitter, 'notification').pipe(
      filter((payload: NotificationEntity) => {
        let shouldEmit;
        if(payload.receiver) {
          shouldEmit = payload.receiver.id === user.id || user.role === 'ADMIN';
        }
        else {
          shouldEmit = user.role === 'ADMIN';
        }
        return shouldEmit;
      }),
      map((payload: any) => {
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
