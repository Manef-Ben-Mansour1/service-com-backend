import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentService } from './comment.service';
import { OrderEntity } from 'src/order/entities/order.entity';
import { ServiceEntity } from 'src/service/entities/service.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { CommentEntity } from './entities/comment.entity';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto,
  service: ServiceEntity, user: UserEntity ) {
    return this.commentService.create(createCommentDto,service,user);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Get(':serviceId')
   getCommentsByServiceId(@Param('serviceId') serviceId: number): Promise<CommentEntity[]> {
    return this.commentService.findCommentsByServiceId(serviceId);
  }
  

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
