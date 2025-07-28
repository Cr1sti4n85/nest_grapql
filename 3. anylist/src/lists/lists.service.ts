import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SearchArgs } from '../common/dto/args/search.args';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
  ) {}
  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const newList = this.listRepository.create({ ...createListInput, user });
    return await this.listRepository.save(newList);
  }

  async findAll(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<List[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    const queryBuilder = this.listRepository
      .createQueryBuilder()
      .where('userId = :userId', { userId: user.id })
      .take(limit)
      .skip(offset);

    if (search) {
      queryBuilder.andWhere('name LIKE :search', { search: `%${search}%` });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = await this.listRepository.findOneBy({
      id,
      user: {
        id: user.id,
      },
    });
    if (!list) {
      throw new ForbiddenException(`Operation not permited.`);
    }

    return list;
  }

  async update(
    id: string,
    updateListInput: UpdateListInput,
    user: User,
  ): Promise<List> {
    await this.findOne(id, user);
    const updatedList = await this.listRepository.preload({
      ...updateListInput,
      user,
    });

    if (!updatedList) {
      throw new BadRequestException(`Item with id ${id} not found`);
    }

    return this.listRepository.save(updatedList);
  }

  async remove(id: string, user: User): Promise<boolean> {
    const list = await this.findOne(id, user);

    const deletedList = await this.listRepository.remove(list);
    if (deletedList) return true;
    return false;
  }

  async listCountByUser(user: User): Promise<number> {
    return await this.listRepository.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}
