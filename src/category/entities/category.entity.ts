import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../generics/timestamp.entity';
import { ProfessionEntity } from '../../profession/entities/profession.entity';


@Entity('category')
export class CategoryEntity extends  TimestampEntity{

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  parentId: number;

  // Define parentCategory relationship
  @ManyToOne(() => CategoryEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId' })
  parentCategory: CategoryEntity;


  @Column({
    nullable: false
  })
  title: string;

  @Column()
  description: string;

  @Column()
  iconPath: string;

  @OneToMany(()=>ProfessionEntity, profession => profession.category,{ cascade: true, onDelete: 'CASCADE' })
  professions: ProfessionEntity[];


}