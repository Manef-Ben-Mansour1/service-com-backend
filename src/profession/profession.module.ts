import { Module } from '@nestjs/common';
import { ProfessionController } from './profession.controller';
import { ProfessionService } from './profession.service';
import { ProfessionEntity } from './entities/profession.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { CategoryEntity } from '../category/entities/category.entity';

import { ServiceEntity } from '../service/entities/service.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ProfessionEntity,UserEntity,CategoryEntity,UserEntity,ServiceEntity])],
  controllers: [ProfessionController],
  providers: [ProfessionService],
})
export class ProfessionModule {}
