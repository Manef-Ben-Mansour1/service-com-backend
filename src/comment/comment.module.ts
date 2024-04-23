import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';

@Module({
  imports:[    TypeOrmModule.forFeature([CommentEntity])],
    controllers:[CommentController],
    providers: [CommentService],
    exports: [CommentService],

})
export class CommentModule { }
