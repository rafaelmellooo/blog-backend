import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../users/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  findOne(id: number): Promise<Post> {
    return this.postsRepository.findOne(id, { relations: ['user'] });
  }

  create(user: User, post: Post): Promise<Post> {
    post.user = user;
    return this.postsRepository.save(post);
  }

  update(id: number, user: User, post: Post): Promise<Post> {
    post.id = id;

    if (!user.posts.map(post => post.id).includes(post.id)) {
      throw new ForbiddenException();
    }

    return this.postsRepository.save(post);
  }

  async remove(id: number, user: User): Promise<void> {
    if (!user.posts.map(post => post.id).includes(id)) {
      throw new ForbiddenException();
    }

    await this.postsRepository.delete(id);
  }
}
