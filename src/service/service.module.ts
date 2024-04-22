import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionEntity } from '../profession/entities/profession.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { ServiceEntity } from './entities/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProfessionEntity,UserEntity,CategoryEntity,UserEntity,ServiceEntity])],

  controllers: [ServiceController],
  providers: [ServiceService]
})
export class ServiceModule {}
