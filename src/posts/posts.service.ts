import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../users/user.entity';
import slugify from 'slugify';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  findOne(slug: string): Promise<Post> {
    return this.postsRepository.findOne({ slug }, { relations: ['user'] });
  }

  async create(user: User, post: Post): Promise<Post> {
    post.slug = slugify(post.title, {
      lower: true,
    });

    post.user = user;

    try {
      return this.postsRepository.save(post);
    } catch {
      throw new BadRequestException();
    }
  }

  async update(slug: string, user: User, post: Post): Promise<Post> {
    let post_id: number;

    try {
      post_id = (
        await this.postsRepository.findOne({ slug }, { select: ['id'] })
      ).id;
    } catch {
      throw new NotFoundException();
    }

    if (!user.posts.map(post => post.id).includes(post_id)) {
      throw new ForbiddenException();
    }

    post.id = post_id;

    post.slug = slugify(post.title, {
      lower: true,
    });

    try {
      return this.postsRepository.save(post);
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(slug: string, user: User): Promise<void> {
    let post_id: number;

    try {
      post_id = (
        await this.postsRepository.findOne({ slug }, { select: ['id'] })
      ).id;
    } catch {
      throw new NotFoundException();
    }

    if (!user.posts.map(post => post.id).includes(post_id)) {
      throw new ForbiddenException();
    }

    await this.postsRepository.delete(post_id);
  }
}
