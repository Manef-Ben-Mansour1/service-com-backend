import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { ServiceEntity } from 'src/service/entities/service.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class CommentService {

  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  create(createCommentDto: CreateCommentDto, 
        service: ServiceEntity,
        user: UserEntity
      )
   : Promise<CommentEntity> {
    const { content } = createCommentDto;
    const newComment = new CommentEntity();
    newComment.content = content;
    newComment.service =service
    // service.find(service => service.id === serviceId);
    newComment.user =user ;
    
    console.log(newComment)

    // Save user to database
    return this.commentRepository.save(newComment);
  }


  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #id comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #id comment`;
  }

  remove(id: number) {
    return `This action removes a #id comment`;
  }

  findCommentsByServiceId(serviceId: number): Promise<CommentEntity[]> {
    return this.commentRepository.find({
      where: {
        service: { id: serviceId },
      },
    });
  }
}
