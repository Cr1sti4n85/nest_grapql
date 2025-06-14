import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

@InputType()
export class UpdateTodoInputs {
  @Field(() => Int, { description: 'id of todo' })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  id: number;

  @Field(() => String, { description: 'describes tass', nullable: true })
  @IsString()
  @MaxLength(30)
  @IsOptional()
  description?: string;

  @Field(() => Boolean, {
    description: 'marks task as completed',
    nullable: true,
  })
  @IsBoolean()
  @IsOptional()
  done?: boolean;
}
