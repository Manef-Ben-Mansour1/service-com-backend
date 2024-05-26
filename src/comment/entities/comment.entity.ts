import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { ServiceEntity } from '../../service/entities/service.entity';
import { TimestampEntity } from '../../generics/timestamp.entity';


@Entity('comment')
export class CommentEntity extends TimestampEntity{

  @PrimaryGeneratedColumn()
  id: number;


  @Column({
    nullable: false,
    length: 255
    
  })
  content: string;

  @ManyToOne (()=>UserEntity,  {eager:true, nullable:false})
  user: UserEntity;

  @ManyToOne (()=>ServiceEntity,service => service.comments, {eager:true, nullable:false})
  service: ServiceEntity;



}