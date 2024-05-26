import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoleEnum } from '../enum/userRole.enum';
import { TimestampEntity } from '../../generics/timestamp.entity';
import { ProfessionEntity } from '../../profession/entities/profession.entity';
import { OrderEntity } from '../../order/entities/order.entity';
import { UserStatusEnum } from '../enum/userStatus.enum';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@Entity('user')
@ObjectType()
export class UserEntity extends TimestampEntity {

  @PrimaryGeneratedColumn()
  @Field(() => ID) // Exposing id field
  id: number;

  @Column({
    nullable: false
  })
  @Field() // Exposing firstName field
  firstName: string;

  @Column({
    nullable: false
  })
  @Field() // Exposing lastName field
  lastName: string;

  @Column({
    nullable: false,
  })
  @Field() // Exposing gouvernorat field
  gouvernorat: string;

  @Column({ nullable: false })
  @Field() // Exposing delegation field
  delegation: string;

  @Column({ nullable: true })
  @Field({ nullable: true }) // Exposing profileImagePath field
  profileImagePath: string;

  @Column({ nullable: true })
  @Field({ nullable: true }) // Exposing document field
  document: string;

  @Column({
    type: "enum",
    enum: UserRoleEnum,
    default: UserRoleEnum.USER
  })
  @Field(() => UserRoleEnum) // Exposing role field
  role: UserRoleEnum;

  @Column({
    nullable: true, 
  })
  @Field(() => UserStatusEnum, { nullable: true }) // Exposing status field
  status: UserStatusEnum;

  @Column({
    unique: true,
    nullable: false,
  })
  @Field() // Exposing email field
  email: string;

  @Column({ nullable: false })
  @Field() // Exposing password field (consider security implications)
  password: string;

  @Column({
    nullable: false,
    unique: true
  })
  @Field() // Exposing salt field (consider security implications)
  salt: string;

  @OneToMany(() => ProfessionEntity, profession => profession.user, { cascade: true, onDelete: 'CASCADE' })
  @Field(() => [ProfessionEntity]) 
  professions: ProfessionEntity[];

  @OneToMany(() => OrderEntity, order => order.user, { cascade: true, onDelete: 'CASCADE' })
  @Field(() => [OrderEntity]) 
  orders: OrderEntity[];
}
