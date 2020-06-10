import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt';

import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<number> {
    const user = await this.usersRepository.findOne({ email });

    if (!user) {
      return null;
    }

    if (!(await compare(password, user.password))) {
      return null;
    }

    return user.id;
  }
}
