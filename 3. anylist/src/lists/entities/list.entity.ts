import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ListItem } from 'src/list-item/entities/list-item.entity';

@ObjectType()
@Entity('lists')
export class List {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.lists, { nullable: false, lazy: true })
  @Field(() => User)
  @Index('idx_list_user_id')
  user: User;

  @OneToMany(() => ListItem, (ListItem) => ListItem.list, { lazy: true })
  // @Field(() => [ListItem])
  listItems: ListItem;
}
