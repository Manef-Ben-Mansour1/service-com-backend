import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceEntity } from './entities/service.entity';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ProfessionEntity } from '../profession/entities/profession.entity';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { AdminGuard } from '../user/guards/admin.guard';

@Controller('service')
export class ServiceController {
  constructor(private readonly ServiceService: ServiceService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createServiceDto: CreateServiceDto,@User() user ): Promise<ServiceEntity> {
    return this.ServiceService.createService(createServiceDto,user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id',ParseIntPipe) id: number, @Body() updateServiceDto: UpdateServiceDto,@User() user): Promise<ServiceEntity> {
    return this.ServiceService.updateService(id, updateServiceDto,user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)

  async delete(@Param('id',ParseIntPipe) id: number,@User() user): Promise<ServiceEntity> {
    return this.ServiceService.deleteService(id,user);
  }

  @Patch('recover/:id')
  @UseGuards(JwtAuthGuard,AdminGuard)
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
