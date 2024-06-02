import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampEntity } from '../../generics/timestamp.entity';
import { ProfessionEntity } from '../../profession/entities/profession.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@Entity('category')
@ObjectType()
export class CategoryEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  parentId: number;

  // Define parentCategory relationship
  @ManyToOne(() => CategoryEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId' })
  @Field(() => CategoryEntity, { nullable: true })
  parentCategory: CategoryEntity;

  @Column({ nullable: false })
  @Field()
  title: string;

  @Column()
  @Field()
  description: string;

  @Column()
  @Field()
  iconPath: string;

  @OneToMany(() => ProfessionEntity, (profession) => profession.category, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [ProfessionEntity], { nullable: true })
  professions: ProfessionEntity[];
}
