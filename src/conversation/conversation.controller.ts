import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ConversationService } from './conversation.service';
import { User } from '../decorators/user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('conversation')
@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  create(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationService.create(createConversationDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/user')
  findUserConversations(@User() user) {
    console.log(user.id);
    return this.conversationService.getConversationsOfOneUser(+user.id);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationService.getConversationById(+id);
  }
  @Get()
  findAll() {
    return this.conversationService.findAll();
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.conversationService.softDelete(+id);
  }
}
