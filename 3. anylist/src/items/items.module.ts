import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';

@Module({
  imports: [
    //typeorm moduel
    TypeOrmModule.forFeature([Item]),
  ],
  providers: [ItemsResolver, ItemsService],
  exports: [ItemsService, TypeOrmModule],
})
export class ItemsModule {}
