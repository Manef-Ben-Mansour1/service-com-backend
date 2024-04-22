import { Module, forwardRef } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageEntity } from './entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => ConversationModule),
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
