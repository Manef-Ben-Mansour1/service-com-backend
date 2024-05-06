import { Controller, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map } from 'rxjs';

@Controller('notification')
export class NotificationController {
  constructor(private eventEmitter: EventEmitter2) {}

  
  @Sse('sse')
  sse(): Observable<any> {
    return fromEvent(this.eventEmitter, 'notification.created').pipe(
      map((payload) => {
        console.log({ payload });
        return { data: payload };
      }),
    );
  }
}