import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

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

  async findAll(): Promise<Item[]> {
    return this.itemsRepository.find();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({ id });
    if (!item) {
      throw new BadRequestException(`Item with id ${id} not found`);
    }
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    const item = await this.itemsRepository.preload(updateItemInput);

    if (!item) {
      throw new BadRequestException(`Item with id ${id} not found`);
    }

    return this.itemsRepository.save(item);
  }

  async remove(id: string): Promise<boolean> {
    const item = await this.findOne(id);

    const deletedItem = await this.itemsRepository.remove(item);
    if (deletedItem) return true;
    return false;
  }
}
