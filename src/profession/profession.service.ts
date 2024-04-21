import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfessionEntity } from './entities/profession.entity';
import { Repository } from 'typeorm';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { UserEntity } from '../user/entities/user.entity';
import { CategoryEntity } from '../category/entities/category.entity';


@Injectable()
export class ProfessionService {
  constructor(
    @InjectRepository(ProfessionEntity)
    private readonly professionRepository: Repository<ProfessionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {
  }

  async createProfession(profession: CreateProfessionDto): Promise<ProfessionEntity> {
    const user = await this.userRepository.findOne({ where: { id: profession.userId } });
    if (!user) {
      throw new BadRequestException('No user with id ' + profession.userId);
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
      throw new BadRequestException('Profession already exists');
    }
    const newProfessionData: Partial<ProfessionEntity> = {
      user,
      category,
    };

    const newProfession = this.professionRepository.create(newProfessionData);
    return await this.professionRepository.save(newProfession);
  }
}

