import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateTodoInputs {
  @Field(() => String, { description: 'what needs to be done' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  description: string;
}
