import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as process from 'node:process';
import { TimestampEntity } from './generics/timestamp.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { CategoryEntity } from './category/entities/category.entity';
import { CommentModule } from './comment/comment.module';
import { CommentEntity } from './comment/entities/comment.entity';
import { ConversationModule } from './conversation/conversation.module';
import { ConversationEntity } from './conversation/entities/conversation.entity';
import { MessageEntity } from './message/entities/message.entity';
import { MessageModule } from './message/message.module';
import { OrderEntity } from './order/entities/order.entity';
import { OrderModule } from './order/order.module';
import { ProfessionEntity } from './profession/entities/profession.entity';
import { ProfessionModule } from './profession/profession.module';
import { RatingEntity } from './rating/entities/rating.entity';
import { MulterModule } from '@nestjs/platform-express';

import { NotificationModule } from './notification/notification.module';
import { NotificationEntity } from './notification/entities/notification.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RatingModule } from './rating/rating.module';
import { ServiceEntity } from './service/entities/service.entity';
import { ServiceModule } from './service/service.module';
import { UserEntity } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { MessagesGateway } from './chat/chat.gateway';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { WsJwtAuthGuard } from './chat/guards/ws-jwt-auth.guard';
import { EventsModule } from './events/events.module';
import { EventsGateway } from './events/events.gateway';
import { WsJwtGuard } from './comment/guards/ws-jwt/ws-jwt.guard';


dotenv.config();

@Module({
  imports: [

    JwtModule.register({
      secret: process.env.SECRET,
    }),

    MulterModule.register({
      dest: './uploads',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        UserEntity,
        CategoryEntity,
        ProfessionEntity,
        ServiceEntity,
        OrderEntity,
        CommentEntity,
        RatingEntity,
        NotificationEntity,
        MessageEntity,
        ConversationEntity,
      ],
      synchronize: true,
    }),
    UserModule,
    CategoryModule,
    ServiceModule,
    OrderModule,
    ProfessionModule,
    CommentModule,
    RatingModule,
    NotificationModule,
    EventEmitterModule.forRoot(),
    MessageModule,
    ConversationModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService, MessagesGateway, JwtService, WsJwtAuthGuard,WsJwtGuard],

})
export class AppModule {}
