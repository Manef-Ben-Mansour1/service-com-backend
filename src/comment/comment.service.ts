import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { ServiceEntity } from 'src/service/entities/service.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class CommentService {
  serviceService: any;

  constructor(
    @InjectRepository(CommentEntity)
    private readonly CommentRepository: Repository<CommentEntity>,
  ) {}
  async create(createRatingDto: CreateCommentDto, serviceId: number, user: UserEntity): Promise<CommentEntity> {
     const content  = CreateCommentDto;

    // Retrieve the service by ID
    const service = await this.serviceService.getServiceById(serviceId);
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Create a new rating
    const newComment = new CommentEntity();
    newComment.content = content.toString();
    newComment.service =service.getServiceById(serviceId);
    newComment.user =user ;

    // Save the rating to the database
    return await this.CommentRepository.save(newComment);
  }



  

  findAll(): Promise<CommentEntity[]> {
    return this.CommentRepository.find();
  }

  findCommentById(id: number): Promise<CommentEntity> {
    return this.CommentRepository.findOne({where :{id}});
  }

  async update(id: number, updateCommentDto: UpdateCommentDto): Promise<CommentEntity> {
    const comment = await this.findCommentById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Update the comment properties
    if (updateCommentDto.content) {
      comment.content = updateCommentDto.content;
    }

    // Save the updated comment to the database
    return await this.CommentRepository.save(comment);
  }

  async remove(id: number): Promise<void> {
    const comment = await this.findCommentById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Remove the comment from the database
    await this.CommentRepository.remove(comment);
  }

  async findCommentsByServiceId(serviceId: number): Promise<CommentEntity[]> {
    return this.CommentRepository.find({
      where: {
        service: { id: serviceId },
      },
    });
  }
}

