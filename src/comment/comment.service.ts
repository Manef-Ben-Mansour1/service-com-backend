import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { ServiceEntity } from 'src/service/entities/service.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ServiceService } from 'src/service/service.service';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class CommentService {
 

  constructor(
    @InjectRepository(CommentEntity)
    private readonly CommentRepository: Repository<CommentEntity>,
    private readonly serviceservice:ServiceService,
  ) {}
  async create(createCommentDto: CreateCommentDto, user: UserEntity): Promise<CommentEntity> {
    
    const newComment = new CommentEntity();
      newComment.content=createCommentDto.content;
      newComment.service = await this.serviceservice.getServiceById(createCommentDto.serviceId);
      newComment.user =user;

      const savedComment = await this.CommentRepository.save(newComment);
  
  return savedComment;
      



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
    if (updateCommentDto.serviceId) {
      comment.service = await this.serviceservice.getServiceById(updateCommentDto.serviceId);
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

