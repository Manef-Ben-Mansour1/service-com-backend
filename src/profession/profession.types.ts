import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../user/user.types';

@ObjectType()
export class Profession {
  @Field(() => ID)
  id: number;
  
  @Field(() => User)
  user: User;
}
