import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageEntity } from './entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ConversationModule } from 'src/conversation/conversation.module';

@Module({
    imports:[    TypeOrmModule.forFeature([MessageEntity]),
    UserModule,
    ConversationModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
