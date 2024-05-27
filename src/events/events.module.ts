import { Module, forwardRef } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { ServiceModule } from 'src/service/service.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
    }),
    UserModule,
    CommentModule,
  ],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}
