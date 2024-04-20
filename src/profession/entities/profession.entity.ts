import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { CategoryEntity } from '../../category/entities/category.entity';
import { TimestampEntity } from '../../generics/timestamp.entity';
import { ServiceEntity } from '../../service/entities/service.entity';

@Entity('profession')
export class ProfessionEntity extends TimestampEntity{

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @ManyToOne(() => UserEntity, user => user.professions,{eager:true,nullable:false})
  user: UserEntity;

  @ManyToOne(() => CategoryEntity, category => category.professions,{eager:true,nullable:false})
  category: CategoryEntity;

  @OneToMany(()=>ServiceEntity, service => service.profession,{ cascade: true, onDelete: 'CASCADE' })
  services: ServiceEntity[];


}
