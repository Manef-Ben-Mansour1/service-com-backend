import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { ServiceEntity } from '../../service/entities/service.entity';
import { TimestampEntity } from '../../generics/timestamp.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@Entity('comment')
@ObjectType()
export class CommentEntity extends TimestampEntity {

  @PrimaryGeneratedColumn()
  @Field(() => ID) // Add this decorator to expose the field in the GraphQL schema
  id: number;

  @Column({
    nullable: false,
    length: 255
  })
  @Field() // Add this decorator to expose the field in the GraphQL schema
  content: string;

  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  @Field(() => UserEntity) // Add this decorator to expose the field in the GraphQL schema
  user: UserEntity;

  @ManyToOne(() => ServiceEntity, service => service.comments, { eager: true, nullable: false })
  @Field(() => ServiceEntity) // Add this decorator to expose the field in the GraphQL schema
  service: ServiceEntity;
}
