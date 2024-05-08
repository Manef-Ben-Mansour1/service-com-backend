import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationEntity } from './entities/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity])], 
  controllers: [NotificationController],
  providers: [NotificationService]
})
export class NotificationModule {}
