import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    user.password = await hash(user.password, 10);

    try {
      const { id: user_id } = await this.usersRepository.save(user);

      return this.usersRepository.findOne(user_id);
    } catch {
      throw new BadRequestException();
    }
  }
}
