import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { ServiceEntity } from '../../service/entities/service.entity';
import { TimestampEntity } from '../../generics/timestamp.entity';
import { Min, Max } from 'class-validator';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@Entity('rating')
@ObjectType()
export class RatingEntity extends TimestampEntity {

  @PrimaryGeneratedColumn()
  @Field(() => ID) // Exposing id field
  id: number;

  @Column({
    nullable: false,
  })
  @Min(0) // Ensure value is >= 0
  @Max(5) // Ensure value is <= 5
  @Field() // Exposing value field
  value: number;

  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  @Field(() => UserEntity) // Exposing user field
  user: UserEntity;

  @ManyToOne(() => ServiceEntity, service => service.ratings, { eager: true, nullable: false })
  @Field(() => ServiceEntity) // Exposing service field
  service: ServiceEntity;
}
