import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class CreateListItemInput {
  @Field(() => Number, { nullable: true })
  @IsNumber()
  @IsOptional()
  quantity: number = 0;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  completed: boolean = false;

  @IsUUID()
  @Field(() => ID)
  listId: string;

  @IsUUID()
  @Field(() => ID)
  itemId: string;
}
