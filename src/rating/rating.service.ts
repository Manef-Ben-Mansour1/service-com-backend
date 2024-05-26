import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { ServiceEntity } from 'src/service/entities/service.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { RatingEntity } from './entities/rating.entity';
import { ServiceService } from 'src/service/service.service';


@Injectable()
export class RatingService {
  
  constructor(
    @InjectRepository(RatingEntity)
    private readonly ratingRepository: Repository<RatingEntity>,
    private readonly serviceservice: ServiceService, 
  ) {}

  async create(createRatingDto: CreateRatingDto, user: UserEntity): Promise<RatingEntity> {
    const newRating = new RatingEntity();
      newRating.value= createRatingDto.value;
      newRating.service = await this.serviceservice.getServiceById(createRatingDto.serviceId);
      newRating.user =user;

      
  
      const savedRating = await this.ratingRepository.save(newRating);
  
      return savedRating;
  }

  
  async getRatingsByServiceId(serviceId: number): Promise<RatingEntity[]> {
    const ratings = await this.ratingRepository.find({
      where: {
        service: { id: serviceId } // Filter by serviceId
      }
    });
    
    return Promise.resolve(ratings);
  }



  async getAvgRating(serviceId: number): Promise<number> {
  const ratings = await this.getRatingsByServiceId(serviceId);
    
  const ratingValues: number[] = ratings.map(rating => rating.value);
    if (ratingValues.length === 0) {
        return 0; // No ratings found, return 0
    }

    const totalRatingValue = ratingValues.reduce((acc, value) => acc + value, 0);
    const averageRating = totalRatingValue / ratingValues.length;

    return averageRating;
}

async update(id: number, updateRatingDto: UpdateRatingDto): Promise<RatingEntity> {
  const rating = await this.findOne(id);
  return await this.ratingRepository.save(rating);
}


  async findAll(): Promise<RatingEntity[]> {
    return await this.ratingRepository.find();
  }

  async findOne(id: number): Promise<RatingEntity> {
    const rating = await this.ratingRepository.findOne({where: {id}});
    if (!rating) {
      throw new NotFoundException('Rating not found');
    }
    return rating;
  }

 
  async remove(id: number): Promise<void> {
    const rating = await this.findOne(id);
    await this.ratingRepository.remove(rating);
  }
}
