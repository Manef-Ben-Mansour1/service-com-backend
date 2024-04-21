import { Body, Controller, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceEntity } from './entities/service.entity';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('service')
export class ServiceController {
  constructor(private readonly ServiceService: ServiceService) {}
  @Post()
  async create(@Body() createServiceDto: CreateServiceDto): Promise<ServiceEntity> {
    return this.ServiceService.createService(createServiceDto);
  }

  @Patch(':id')
  async update(@Param('id',ParseIntPipe) id: number, @Body() updateServiceDto: UpdateServiceDto): Promise<ServiceEntity> {
    return this.ServiceService.updateService(id, updateServiceDto);
  }

}
