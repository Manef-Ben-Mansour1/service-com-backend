import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Profession } from '../profession/profession.types';
import { Rating } from '../rating/rating.types';
import { Comment } from '../comment/comment.types';

@ObjectType()
export class Service {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => Profession)
  profession: Profession;

  @Field(() => [Rating])
  ratings: Rating[];

  @Field(() => [Comment])
  comments: Comment[];
}
