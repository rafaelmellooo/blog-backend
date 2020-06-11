import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
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

  login(user: number): { access_token: string } {
    const payload = { user };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
