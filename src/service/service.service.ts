import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../category/entities/category.entity';
import { Repository } from 'typeorm';
import { ProfessionEntity } from '../profession/entities/profession.entity';
import { ServiceEntity } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { isInt } from 'class-validator';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(ProfessionEntity)
    private readonly professionRepository: Repository<ProfessionEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
  ) {}

  async createService(
    createServiceDto: CreateServiceDto,
  ): Promise<ServiceEntity> {
    const profession = await this.professionRepository.findOne({
      where: { id: createServiceDto.professionId },
    });
    if (!profession) {
      throw new BadRequestException('No Profession with this id');
    }

    const newServiceData: Partial<ServiceEntity> = {
      profession,
      title: createServiceDto.title,
      description: createServiceDto.description,
      basePrice: createServiceDto.basePrice,
      imagePath: createServiceDto.imagePath,
    };
    const service = this.serviceRepository.create(newServiceData);
    return await this.serviceRepository.save(service);
  }
  async updateService(
    id: number,
    updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceEntity> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new BadRequestException('No Service with this id');
    }
    const professionId = updateServiceDto.professionId ?? service.profession.id;
    const profession = await this.professionRepository.findOne({
      where: { id: professionId },
    });
    if (!profession) {
      throw new BadRequestException('No Profession with this id');
    }

    const newServiceData: Partial<ServiceEntity> = {
      profession,
      title: updateServiceDto.title ?? service.title,
      description: updateServiceDto.description ?? service.description,
      basePrice: updateServiceDto.basePrice ?? service.basePrice,
      imagePath: updateServiceDto.imagePath ?? service.imagePath,
    };
    const updatedservice = this.serviceRepository.merge(
      service,
      newServiceData,
    );
    return await this.serviceRepository.save(service);
  }

  async deleteService(id: number): Promise<ServiceEntity> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new BadRequestException('No Service with this id');
    }

    return await this.serviceRepository.softRemove(service);
  }

  async recoverService(id: number): Promise<ServiceEntity> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!service) {
      throw new BadRequestException('No Service with this id');
    }

    if (!service.deletedAt) {
      throw new BadRequestException('Service is not deleted');
    }

    return await this.serviceRepository.recover(service);
  }

  async getAllServicesWithPagination(
    page: number,
    pageSize: number,
  ): Promise<ServiceEntity[]> {
    if (page <= 0) {
      throw new BadRequestException('Page number should be greater than 0');
    }
    if (pageSize <= 0) {
      throw new BadRequestException('Page size should be greater than 0');
    }
    if (!isInt(page)) {
      throw new BadRequestException('Page number should be an integer');
    }
    if (!isInt(pageSize)) {
      throw new BadRequestException('Page size should be an integer');
    }

    const skip = (page - 1) * pageSize;
    return this.serviceRepository.find({
      skip,
      take: pageSize,
    });
  }
  async getAllServices(): Promise<ServiceEntity[]> {
    return this.serviceRepository.find();
  }

  async getServiceById(id: number): Promise<ServiceEntity> {
    const service = await this.serviceRepository.findOne({ 
      where: { id },
      relations: ['ratings', 'comments', 'orders'], 
    });
    if (!service) {
      throw new NotFoundException('No Service with this id');
    }
    return service;
  }
}
