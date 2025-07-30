import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../items/entities/item.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';
import { ListItem } from '../list-item/entities/list-item.entity';
import { List } from '../lists/entities/list.entity';
import { ListsService } from '../lists/lists.service';
import { ListItemService } from '../list-item/list-item.service';

@Injectable()
export class SeedService {
  private isProd: boolean;
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
    private readonly listItemsService: ListItemService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
    @InjectRepository(ListItem)
    private readonly listItemsRepository: Repository<ListItem>,
    @InjectRepository(List) private readonly listRepository: Repository<List>,
  ) {
    this.isProd = this.configService.get<string>('STATE') === 'prod';
  }

  async seed(): Promise<boolean> {
    if (this.isProd) {
      throw new UnauthorizedException(
        'No se puede hacer la operación en producción',
      );
    }
    // limpia la base de datos y pobla con datos iniciales

    await this.deleteDatabase();
    //crear users

    const user = await this.loadUsers();

    // crear items
    await this.loadItems(user);

    // crear listas
    const list = await this.loadLists(user);

    // crear listItems
    const items = await this.itemsService.findAll(
      user,
      { limit: 15, offset: 0 },
      {},
    );
    await this.loadListItems(list, items);

    console.log('Database seeded successfully');
    return true;
  }

  private async deleteDatabase(): Promise<void> {
    await this.listItemsRepository.query('DELETE FROM list_items');
    await this.listRepository.query('DELETE FROM lists');
    await this.itemRepository.query('DELETE FROM items');
    await this.userRepository.query('DELETE FROM users');
    console.log('Database cleared');
  }

  async loadUsers(): Promise<User> {
    const users: User[] = [];
    for (const user of SEED_USERS) {
      users.push(await this.userService.create(user));
    }
    return users[0];
  }

  async loadItems(user: User): Promise<void> {
    const items: Promise<Item>[] = [];
    for (const item of SEED_ITEMS) {
      items.push(this.itemsService.create(item, user));
    }
    await Promise.all(items);
  }

  async loadLists(user: User): Promise<List> {
    const lists: Promise<List>[] = [];
    for (const list of SEED_LISTS) {
      lists.push(this.listsService.create(list, user));
    }
    await Promise.all(lists);
    return lists[0];
  }

  async loadListItems(list: List, items: Item[]) {
    for (const item of items) {
      this.listItemsService.create({
        itemId: item.id,
        listId: list.id,
        quantity: Math.round(Math.random() * 10) + 1,
        completed: Math.random() > 0.5,
      });
    }
  }
}
