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
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentService } from './comment.service';
import { OrderEntity } from 'src/order/entities/order.entity';
import { ServiceEntity } from 'src/service/entities/service.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { CommentEntity } from './entities/comment.entity';
import { AdminGuard } from 'src/user/guards/admin.guard';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
@UseGuards(JwtAuthGuard)

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto,
   @User() user: any ) {
    return this.commentService.create(createCommentDto,user);
  }
 
  
  @Get(':serviceId')
   getCommentsByServiceId(@Param('serviceId') serviceId: number): Promise<CommentEntity[]> {
    return this.commentService.findCommentsByServiceId(serviceId);
  }
  @Get()
  getComments(): Promise<CommentEntity[]> {
   return this.commentService.findAll();
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
