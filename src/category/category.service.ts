import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { NotFoundError } from 'rxjs';
import { ProfessionEntity } from '../profession/entities/profession.entity';
import { ServiceEntity } from '../service/entities/service.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { OrderServiceEntity } from '../order-service/entities/order-service.entity';
import { isInt } from 'class-validator';

@Injectable()
export class CategoryService {
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
  ) {
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async updateCategory(id: number, updateCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    this.categoryRepository.merge(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async deleteCategory(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({ where: { id }, relations: ['professions'] });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    for (const profession of category.professions) {
      await this.softRemoveProfessionAndServices(profession);
    }

    await this.deleteCategoryAndChildren(category);

    return category;
  }

  async deleteCategoryAndChildren(category: CategoryEntity): Promise<void> {
    const children = await this.categoryRepository.find({ where: { parentId: category.id } });

    if (children.length > 0) {
      for (const child of children) {
        await this.deleteCategoryAndChildren(child);
      }
    }

    await this.categoryRepository.softRemove(category);
  }

  async softRemoveProfessionAndServices(profession: ProfessionEntity): Promise<void> {
    const services = await this.serviceRepository.find({
      where: { profession: { id: profession.id } },
      relations: ['profession']
    });
    for (const service of services) {

      await this.serviceRepository.softRemove(service);
    }
    await this.professionRepository.softRemove(profession);
  }



  async recoverCategory(id: number): Promise<CategoryEntity> {

    const deletedCategory = await this.categoryRepository.findOne({
      where: { id },
      withDeleted: true,
      relations: ['professions']
    });

    if (!deletedCategory) {
      throw new NotFoundException('Soft-deleted category not found');
    }
    if (!deletedCategory.deletedAt) {
      throw new BadRequestException('Category is not deleted');
    }
    for (const profession of deletedCategory.professions) {
      await this.recoverProfessionAndServices(profession);
    }
    await this.recoverCategoryAndChildren(deletedCategory);

    return deletedCategory;
  }

  async recoverCategoryAndChildren(category: CategoryEntity): Promise<void> {
    const children = await this.categoryRepository.find({ where: { parentId: category.id }, withDeleted: true });

    if (children.length > 0) {
      for (const child of children) {
        await this.recoverCategoryAndChildren(child);
      }
    }

    await this.categoryRepository.recover(category);
  }

  async recoverProfessionAndServices(profession: ProfessionEntity): Promise<void> {
    const services = await this.serviceRepository.find({
      where: { profession: { id: profession.id } },
      relations: ['profession'],
      withDeleted: true
    });
    for (const service of services) {

      await this.serviceRepository.recover(service);

    }
    await this.professionRepository.recover(profession);
  }



  async getAllCategories(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find();
  }

  async getAllCategoriesWithPagination(page: number, pageSize: number): Promise<CategoryEntity[]> {
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
    return this.categoryRepository.find({
      skip,
      take: pageSize,
    });
  }

  async getCategoryById(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;

  }

}


