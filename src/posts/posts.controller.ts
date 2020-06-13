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
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { User } from '../user.decorator';
import { PostsService } from './posts.service';
import { Post } from './post.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User as UserEntity } from '../users/user.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(): Promise<Post[]> {
    return this.postsService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':slug')
  findOne(@Param('slug') slug: string): Promise<Post> {
    return this.postsService.findOne(slug);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpPost()
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.CREATED)
  async create(
    @UploadedFile() image: Express.Multer.File,
    @User() user: UserEntity,
    @Body() post: Post,
  ): Promise<Post> {
    return this.postsService.create(
      user,
      JSON.parse(JSON.stringify(post)),
      image,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':slug')
  async update(
    @Param('slug') slug: string,
    @User() user: UserEntity,
    @Body() post: Post,
  ): Promise<Post> {
    return this.postsService.update(slug, user, post);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':slug')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('slug') slug: string,
    @User() user: UserEntity,
  ): Promise<void> {
    try {
      await this.postsService.remove(slug, user);
    } catch (exception) {
      throw exception;
    }
  }
}
