import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { ListItem } from './entities/list-item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from '../lists/entities/list.entity';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SearchArgs } from '../common/dto/args/search.args';
import { take } from 'rxjs';

@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
  ) {}
  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { listId, itemId, ...rest } = createListItemInput;
    const newListItem = this.listItemRepository.create({
      ...rest,
      list: { id: listId },
      item: { id: itemId },
    });

    return await this.listItemRepository.save(newListItem);
  }

  async findAll(
    list: List,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<ListItem[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    const queryBuilder = this.listItemRepository
      .createQueryBuilder('list_items')
      .innerJoin('list_items.item', 'item')
      .take(limit)
      .skip(offset)
      .where('listId = :listId', { listId: list.id });

    if (search) {
      queryBuilder.andWhere('item.name ILIKE :search', {
        search: `%${search}%`,
      });
    }
    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<ListItem> {
    const foundListItem = await this.listItemRepository.findOneBy({ id });
    if (!foundListItem) {
      throw new NotFoundException(`List item with id ${id} not found`);
    }
    return foundListItem;
  }

  async update(
    id: string,
    updateListItemInput: UpdateListItemInput,
  ): Promise<ListItem> {
    const { listId, itemId, ...rest } = updateListItemInput;

    const queryBuilder = this.listItemRepository
      .createQueryBuilder()
      .update()
      .set(rest)
      .where('id = :id', { id });

    if (listId) {
      queryBuilder.set({ list: { id: listId } });
    }

    if (itemId) {
      queryBuilder.set({ item: { id: itemId } });
    }
    const result = await queryBuilder.execute();
    if (result.affected === 0) {
      throw new NotFoundException(`List item with id ${id} not found`);
    }

    return await this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }

  async countListItems(list: List): Promise<number> {
    return await this.listItemRepository.count({
      where: { list: { id: list.id } },
    });
  }
}
