import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  controllers: [CommentController, CommentController],
  providers: [CommentService, CommentService]
})
export class CommentModule { }
