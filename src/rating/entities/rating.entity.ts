import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { ServiceEntity } from '../../service/entities/service.entity';
import { TimestampEntity } from '../../generics/timestamp.entity';
import { Min, Max } from 'class-validator';




@Entity('rating')
export class RatingEntity extends TimestampEntity{

  @PrimaryGeneratedColumn()
  id: number;


  @Column({
    nullable: false,
  })
  @Min(0) // Ensure value is >= 0
  @Max(5) // Ensure value is <= 5
  value: number;



  @ManyToOne (()=>UserEntity,  {eager:true, nullable:false})
  user: UserEntity;

  @ManyToOne (()=>ServiceEntity,service => service.ratings, {eager:true, nullable:false})
  service: ServiceEntity;


}