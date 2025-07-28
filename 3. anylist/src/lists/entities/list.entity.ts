import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity('lists')
export class List {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.lists, { nullable: false })
  @Field(() => User)
  @Index('idx_list_user_id')
  user: User;
}
