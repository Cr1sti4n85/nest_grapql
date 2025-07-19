import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignupInput } from '../auth/dto/inputs/signup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcryptjs';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...signupInput,
        password: hashSync(signupInput.password, 10),
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    if (roles.length === 0)
      return this.userRepository
        .find
        //la entity tiene configuration lazy
        //     {
        //         relations: {
        //           lastUpdatedBy: true,
        //         },
        //  }
        ();

    const queries = roles
      .map((role) => `JSON_CONTAINS(user.roles, '"${role}"')`)
      .join(' OR ');
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where(queries)
      .getMany();

    return users;
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      this.handleDBExceptions({
        code: 'EMAIL_NOT_FOUND',
        detail: `User with email ${email} not found`,
      });
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDBExceptions({
        code: 'ID_NOT_FOUND',
        detail: `User with email ${id} not found`,
      });
    }
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  async block(id: string, adminUser: User): Promise<User> {
    const user = await this.findOneById(id);
    user.isBlocked = true;
    user.lastUpdatedBy = adminUser;
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any): never {
    if (error.code === 'ER_DUP_ENTRY')
      throw new BadRequestException(error.detail);

    if (error.code === 'EMAIL_NOT_FOUND')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
