import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { UsersModule } from '../users/users.module';
import { ItemsModule } from '../items/items.module';
import { ListItemModule } from '../list-item/list-item.module';
import { ListsModule } from '../lists/lists.module';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [UsersModule, ItemsModule, ListItemModule, ListsModule],
})
export class SeedModule {}
