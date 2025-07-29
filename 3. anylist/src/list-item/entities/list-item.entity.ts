import { Field, ID, ObjectType } from '@nestjs/graphql';
import { List } from '../../lists/entities/list.entity';
import { Item } from '../../items/entities/item.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity('listItems')
export class ListItem {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'numeric' })
  @Field(() => Number)
  quantity: number;

  @Column({ type: 'boolean' })
  @Field(() => Boolean)
  completed: boolean;

  @ManyToOne(() => List, (list) => list.listItems, { lazy: true })
  list: List;

  @ManyToOne(() => Item, (item) => item.listItems, { lazy: true })
  @Field(() => Item)
  item: Item;
}
