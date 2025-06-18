import { Field, Float, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsPositive()
  @Field(() => Float)
  quantity: number;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  quantityUnits?: string;
}
