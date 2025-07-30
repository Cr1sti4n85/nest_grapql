import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../items/entities/item.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { UsersService } from '../users/users.service';
import { ItemsService } from 'src/items/items.service';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { List } from 'src/lists/entities/list.entity';

@Injectable()
export class SeedService {
  private isProd: boolean;
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly itemsService: ItemsService,
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
}
