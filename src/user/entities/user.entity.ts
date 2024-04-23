import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoleEnum } from '../enum/userRole.enum';
import { TimestampEntity } from '../../generics/timestamp.entity' ;
import { ProfessionEntity } from '../../profession/entities/profession.entity';
import { OrderEntity } from '../../order/entities/order.entity';


@Entity('user')
export class UserEntity extends TimestampEntity{

  @PrimaryGeneratedColumn()
  id: number;


  @Column({
    nullable: false
  })
  firstName: string;


  @Column({
    nullable: false
  })
  lastName: string;


  @Column({
    nullable: false,
  })
  gouvernorat: string;


  @Column({nullable: false})
  delegation: string;


  @Column({
  })
  profileImagePath: string;

  @Column({
    type: "enum",
    enum: UserRoleEnum,
    default: UserRoleEnum.USER
  })
  role: UserRoleEnum;


  @Column({
    unique: true,
    nullable: false,
  })
  email: string;


  @Column({nullable: false})
  password: string;


  @Column({nullable: false,
    unique: true
  })
  salt: string;

  @OneToMany(()=>ProfessionEntity , profession => profession.user,{ cascade: true, onDelete: 'CASCADE' })
  professions: ProfessionEntity[];

  @OneToMany(()=>OrderEntity , order => order.user,{ cascade: true, onDelete: 'CASCADE' })
  orders: OrderEntity[];

}