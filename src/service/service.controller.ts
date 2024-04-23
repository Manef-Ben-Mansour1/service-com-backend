import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceEntity } from './entities/service.entity';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ProfessionEntity } from '../profession/entities/profession.entity';

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

  @Delete(':id')
  async delete(@Param('id',ParseIntPipe) id: number): Promise<ServiceEntity> {
    return this.ServiceService.deleteService(id);
  }

  @Patch('recover/:id')
  async recover(@Param('id',ParseIntPipe) id: number): Promise<ServiceEntity> {
    return this.ServiceService.recoverService(id);
  }

  @Get()
  async getAllServices(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ): Promise<ServiceEntity[]> {
    if (!page || !pageSize) {
      return this.ServiceService.getAllServices();
    }

    return this.ServiceService.getAllServicesWithPagination(+page, +pageSize);
  }

  @Get(':id')
  async getServiceById(@Param('id', ParseIntPipe) id: number): Promise<ServiceEntity> {
    return this.ServiceService.getServiceById(id);
  }

}
