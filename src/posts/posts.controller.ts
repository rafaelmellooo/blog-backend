import {
  Controller,
  Get,
  Post as HttpPost,
  Body,
  HttpCode,
  Param,
  Put,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post } from './post.entity';
import { UpdateResult } from 'typeorm';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(): Promise<Post[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Post> {
    return this.postsService.findOne(id);
  }

  @HttpPost()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() post: Post): Promise<Post> {
    return this.postsService.create(post);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() post: Post): Promise<UpdateResult> {
    return this.postsService.update(id, post);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    await this.postsService.remove(id);
  }
}
