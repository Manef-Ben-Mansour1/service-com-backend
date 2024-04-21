import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationService } from './conversation.service';
import { ConversationEntity } from './entities/conversation.entity';
import { UserModule } from '../user/user.module';
import { ConversationController } from './conversation.controller';

@Module({
    imports:[    TypeOrmModule.forFeature([ConversationEntity]),
UserModule],
    controllers:[ConversationController],
    providers: [ConversationService],
    exports:[ConversationService]
})
export class ConversationModule {

}
