import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { ServiceEntity } from 'src/service/entities/service.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingEntity } from './entities/rating.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { ProfessionEntity } from 'src/profession/entities/profession.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { ServiceModule } from 'src/service/service.module';


@Module({
  imports:[TypeOrmModule.forFeature([ServiceEntity,RatingEntity,CategoryEntity,ProfessionEntity,UserEntity,CommentEntity]),
  ServiceModule
],
  providers: [RatingService],
  controllers: [RatingController]

})
export class RatingModule {}
