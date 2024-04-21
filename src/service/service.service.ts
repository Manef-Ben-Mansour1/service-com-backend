import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../category/entities/category.entity';
import { Repository } from 'typeorm';
import { ProfessionEntity } from '../profession/entities/profession.entity';
import { ServiceEntity } from './entities/service.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { OrderServiceEntity } from '../order-service/entities/order-service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(ProfessionEntity)
    private readonly professionRepository: Repository<ProfessionEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderServiceEntity)
    private readonly orderServiceRepository: Repository<OrderServiceEntity>,
  ) {}

  async createService(createServiceDto:CreateServiceDto): Promise<ServiceEntity> {
    const profession = await this.professionRepository.findOne({ where: { id: createServiceDto.professionId } });
    if(!profession){
      throw new BadRequestException('No Profession with this id');
    }

    const newServiceData: Partial<ServiceEntity> = {
      profession,
      title: createServiceDto.title,
      description: createServiceDto.description,
      basePrice: createServiceDto.basePrice,
      imagePath: createServiceDto.imagePath,
    };
    const service=this.serviceRepository.create(newServiceData);
    return await this.serviceRepository.save(service);
  }
  async updateService(id:number,updateServiceDto:UpdateServiceDto): Promise<ServiceEntity> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new BadRequestException('No Service with this id');
    }
    const professionId=updateServiceDto.professionId??service.profession.id;
    const profession = await this.professionRepository.findOne({ where: { id: professionId } });
    if(!profession){
      throw new BadRequestException('No Profession with this id');
    }

    const newServiceData: Partial<ServiceEntity> = {
      profession,
      title: updateServiceDto.title??service.title,
      description: updateServiceDto.description??service.description,
      basePrice: updateServiceDto.basePrice??service.basePrice,
      imagePath: updateServiceDto.imagePath??service.imagePath,
    };
    const updatedservice=this.serviceRepository.merge(service,newServiceData);
    return await this.serviceRepository.save(service);
  }
}
