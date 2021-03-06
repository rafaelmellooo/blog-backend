import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }
}
