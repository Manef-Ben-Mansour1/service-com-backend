import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfessionEntity } from './entities/profession.entity';
import { Repository } from 'typeorm';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { UserEntity } from '../user/entities/user.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { UpdateProfessionDto } from './dto/update-profession.dto';
import { ServiceEntity } from '../service/entities/service.entity';

import { isInt } from 'class-validator';


@Injectable()
export class ProfessionService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(ProfessionEntity)
    private readonly professionRepository: Repository<ProfessionEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,


  ) {
  }

  async createProfession(profession: CreateProfessionDto): Promise<ProfessionEntity> {
    const user = await this.userRepository.findOne({ where: { id: profession.userId } });
    if (!user) {
      throw new BadRequestException('No user with id ' + profession.userId);
    }
    if(user.role!="SERVICE_PROVIDER"){
      throw new BadRequestException('User is not a service provider');
    }

    const category = await this.categoryRepository.findOne({ where: { id: profession.categoryId } });
    if (!category) {
      throw new BadRequestException('No category with id ' + profession.categoryId);
    }

    const existingProfessions = await this.professionRepository.find({
      where: {
        user: { id: profession.userId },
        category: { id: profession.categoryId }
      }
    });
    if (existingProfessions.length > 0) {
      throw new BadRequestException('Profession already exists with this user and category');
    }
    const newProfessionData: Partial<ProfessionEntity> = {
      user,
      category,
    };

    const newProfession = this.professionRepository.create(newProfessionData);
    return await this.professionRepository.save(newProfession);
  }

  async updateProfession(id: number, profession: UpdateProfessionDto): Promise<ProfessionEntity> {

    const existingProfession = await this.professionRepository.findOne({ where: { id } });
    if (!existingProfession) {
      throw new BadRequestException('Profession not found');
    }
    let user=existingProfession.user;
    if(profession.userId){
       user = await this.userRepository.findOne({ where: { id: profession.userId } });
      if (!user) {
        throw new BadRequestException('No user with id ' + profession.userId);
      }

    }
    if(user.role!="SERVICE_PROVIDER"){
      throw new BadRequestException('User is not a service provider');
    }
   let category=existingProfession.category
   if(profession.categoryId){
      category = await this.categoryRepository.findOne({ where: { id: profession.categoryId } });
     if (!category) {
       throw new BadRequestException('No category with id ' + profession.categoryId);
     }
   }
    const existingProfessions = await this.professionRepository.find({
      where: {
        user: { id: user.id },
        category: { id: category.id}
      }
    });
    if (existingProfessions.length > 0) {
      throw new BadRequestException('Profession already exists with this user and category');
    }




    const updatedProfessionData: Partial<ProfessionEntity> = {
      user,
      category,
    };

    const updatedProfession = this.professionRepository.merge(existingProfession, updatedProfessionData);
    return await this.professionRepository.save(updatedProfession);
  }

  async deleteProfession(id: number): Promise<ProfessionEntity> {
    const profession = await this.professionRepository.findOne({ where: { id } });
    if (!profession) {
      throw new BadRequestException('Profession not found');
    }
    await this.softRemoveServicesAndOrdersAndOrderServices(profession);
    return await this.professionRepository.softRemove(profession);
  }
  async softRemoveServicesAndOrdersAndOrderServices(profession: ProfessionEntity): Promise<void> {
    const services = await this.serviceRepository.find({ where: { profession: { id: profession.id } }, relations: ['profession'] });
    for (const service of services) {
      await this.serviceRepository.softRemove(service);
    }

  }



  async recoverProfession(id: number): Promise<ProfessionEntity> {
    const profession = await this.professionRepository.findOne({ where: { id }, withDeleted: true });
    if (!profession) {
      throw new BadRequestException('Profession not found');
    }
    if(!profession.deletedAt){
      throw new BadRequestException('Profession is not deleted');
    }
     await this.recoverServicesAndOrdersAndOrderServices(profession);
    return await this.professionRepository.recover(profession);
  }
  async recoverServicesAndOrdersAndOrderServices(profession: ProfessionEntity): Promise<void> {
    const services = await this.serviceRepository.find({ where: { profession: { id: profession.id } }, relations: ['profession'],withDeleted: true });
    for (const service of services) {

      await this.serviceRepository.recover(service);
    }

  }



  async getAllProfessionsWithPagination(page: number, pageSize: number): Promise<ProfessionEntity[]> {
    if(page<=0){
      throw new BadRequestException('Page number should be greater than 0');
    }
    if(pageSize<=0) {
      throw new BadRequestException('Page size should be greater than 0');
    }
    if(!isInt(page)){
      throw new BadRequestException('Page number should be an integer');
    }
    if(!isInt(pageSize)){
      throw new BadRequestException('Page size should be an integer');
    }

    const skip = (page - 1) * pageSize;
    return this.professionRepository.find({
      skip,
      take: pageSize,
    });
  }
  async getAllProfessions(): Promise<ProfessionEntity[]> {
    return this.professionRepository.find();
  }

  async getProfessionById(id: number): Promise<ProfessionEntity> {
    const profession=await this.professionRepository.findOne({ where: { id } });

    if(!profession) {

      throw new BadRequestException('Profession not found');
    }
    return profession;

  }
}

