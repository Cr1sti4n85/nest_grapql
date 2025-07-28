import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import { Like, Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SearchArgs } from '../common/dto/args/search.args';

@Injectable()
export class ItemsService {
  //dependency injection
  constructor(
    @InjectRepository(Item) private readonly itemsRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemsRepository.create({
      ...createItemInput,
      user, // associate the item with the current user
    });
    await this.itemsRepository.save(newItem);
    return newItem;
  }

  async findAll(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<Item[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    // const items = await this.itemsRepository.find({
    //   take: limit,
    //   skip: offset,
    //   where: {
    //     user: {
    //       id: user.id,
    //     },
    //     name: Like('%' + (search || '') + '%'),
    //   },
    // });
    // return items;
    const queryBuilder = this.itemsRepository
      .createQueryBuilder()
      .where('userId = :userId', { userId: user.id })
      .take(limit)
      .skip(offset);

    if (search) {
      queryBuilder.andWhere('name LIKE :search', { search: `%${search}%` });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({
      id,
      user: {
        id: user.id,
      },
    });
    if (!item) {
      throw new ForbiddenException(`Operation not permited.`);
    }

    return item;
  }

  async update(
    id: string,
    updateItemInput: UpdateItemInput,
    user: User,
  ): Promise<Item> {
    await this.findOne(id, user);
    const item = await this.itemsRepository.preload(updateItemInput);

    if (!item) {
      throw new BadRequestException(`Item with id ${id} not found`);
    }

    return this.itemsRepository.save(item);
  }

  async remove(id: string, user: User): Promise<boolean> {
    const item = await this.findOne(id, user);

    const deletedItem = await this.itemsRepository.remove(item);
    if (deletedItem) return true;
    return false;
  }

  async itemCountByUser(user: User): Promise<number> {
    return await this.itemsRepository.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}
