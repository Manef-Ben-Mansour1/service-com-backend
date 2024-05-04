import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { RatingEntity } from './entities/rating.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from '../service/entities/service.entity';
import { ServiceModule } from 'src/service/service.module';

@Module({
  imports: [TypeOrmModule.forFeature([RatingEntity]), ServiceModule],
  providers: [RatingService],
  controllers: [RatingController],
})
export class RatingModule {}
