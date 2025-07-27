import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Item } from '../../items/entities/item.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  fullName: string;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column()
  password: string;

  @Column({ type: 'json', nullable: true })
  @Field(() => [String])
  roles: string[];

  @Column({ default: false, type: 'boolean' })
  @Field(() => Boolean)
  isBlocked: boolean;

  @ManyToOne(() => User, (user) => user.lastUpdatedBy, {
    nullable: true,
    lazy: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'lastUpdatedBy' })
  @Field(() => User, { nullable: true })
  lastUpdatedBy?: User;

  @OneToMany(() => Item, (item) => item.user, { eager: true })
  @Field(() => [Item])
  items: Item[];
}
