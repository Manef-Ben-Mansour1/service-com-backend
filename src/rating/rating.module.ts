import { Module } from '@nestjs/common';
import { RatingEntity } from './entities/rating.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from '../service/entities/service.entity';
import { ServiceModule } from 'src/service/service.module';

@Module({
  imports: [TypeOrmModule.forFeature([RatingEntity]), ServiceModule],
})
export class RatingModule {}
