import { Module, forwardRef } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { ServiceService } from 'src/service/service.service';
import { ProfessionEntity } from 'src/profession/entities/profession.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { ServiceEntity } from 'src/service/entities/service.entity';
import { ServiceModule } from 'src/service/service.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity,CategoryEntity,ServiceEntity,ProfessionEntity,UserEntity]),
    ServiceModule
  ],
  controllers: [CommentController],
  providers: [CommentService, ServiceService],
  exports: [CommentService],
})
export class CommentModule { }
