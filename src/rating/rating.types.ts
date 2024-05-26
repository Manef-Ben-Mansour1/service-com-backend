import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../user/user.types';

@ObjectType()
export class Rating {
  @Field(() => ID)
  id: number;

  @Field()
  value: number;

  @Field(() => User)
  user: User;
}
