import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../user/user.types';

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: number;

  @Field()
  content: string;

  @Field(() => User)
  user: User;
}
