import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  findOne(id: number): Promise<Post> {
    return this.postsRepository.findOne(id);
  }

  create(post: Post): Promise<Post> {
    return this.postsRepository.save(post);
  }

  update(id: number, post: Post): Promise<UpdateResult> {
    return this.postsRepository.update(id, post);
  }

  async remove(id: number): Promise<void> {
    await this.postsRepository.delete(id);
  }
}
