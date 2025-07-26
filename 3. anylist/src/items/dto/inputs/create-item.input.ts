import { Field, Float, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  quantityUnits?: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  category: string;
}
