import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { CategoryEntity } from '../../category/entities/category.entity';
import { TimestampEntity } from '../../generics/timestamp.entity';
import { ServiceEntity } from '../../service/entities/service.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@Entity('profession')
@ObjectType()
export class ProfessionEntity extends TimestampEntity {

  @PrimaryGeneratedColumn()
  @Field(() => ID) // Add this decorator to expose the field in the GraphQL schema
  id: number;

  @ManyToOne(() => UserEntity, user => user.professions, { eager: true })
  @Field(() => UserEntity) // Add this decorator to expose the field in the GraphQL schema
  user: UserEntity;

  @ManyToOne(() => CategoryEntity, category => category.professions, { eager: true, nullable: false })
  @Field(() => CategoryEntity) // Add this decorator to expose the field in the GraphQL schema
  category: CategoryEntity;

  @OneToMany(() => ServiceEntity, service => service.profession, { cascade: true, onDelete: 'CASCADE' })
  @Field(() => [ServiceEntity]) // Add this decorator to expose the field in the GraphQL schema
  services: ServiceEntity[];
}
