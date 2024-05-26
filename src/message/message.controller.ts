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
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageService } from './message.service';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { AdminGuard } from 'src/user/guards/admin.guard';
import { AdminOrSelfGuard } from 'src/user/guards/admin-or-self.guard';
import { User } from 'src/decorators/user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createMessageDto: CreateMessageDto, @User() user: UserEntity) {
    return this.messageService.create(createMessageDto, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  findAll() {
    return this.messageService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminOrSelfGuard)
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminOrSelfGuard)
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  softDelete(@Param('id') id: string) {
    return this.messageService.softDelete(+id);
  }
}
