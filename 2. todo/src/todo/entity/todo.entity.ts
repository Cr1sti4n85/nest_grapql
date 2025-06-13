import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Todo {
  @Field(() => Int, { nullable: false })
  id: number;

  @Field(() => String)
  description: string;

  @Field(() => Boolean, { defaultValue: false })
  done?: boolean = false;
}
