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
  serviceRepository: any;
  ratingService: any;
  constructor(
    @InjectRepository(RatingEntity)
    private readonly ratingRepository: Repository<RatingEntity>,
    private readonly serviceService: ServiceService, 
  ) {}

  async create(createRatingDto: CreateRatingDto, serviceId: number, user: UserEntity): Promise<RatingEntity> {
    const { value } = createRatingDto;

    // Retrieve the service by ID
    const service = await this.serviceService.getServiceById(serviceId);
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Create a new rating
    const newRating = new RatingEntity();
    newRating.value = value;
    newRating.service = service;
    newRating.user = user;

    // Save the rating to the database
    return await this.ratingRepository.save(newRating);
  }
  async getRatingByServieId( serviceId: number): Promise<RatingEntity> {
    const ratings = await this.serviceRepository.find({
      where: {
          service: { id: serviceId }
      }
  });
            return ratings;
  }



  async getAvgRating(serviceId: number): Promise<number> {
  const ratings = await this.ratingService.getRatingByServieId(serviceId);
    
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
