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
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post } from './post.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/user.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(): Promise<Post[]> {
    return this.postsService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string): Promise<Post> {
    return this.postsService.findOne(slug);
  }

  @UseGuards(JwtAuthGuard)
  @HttpPost()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req: { user: User },
    @Body() post: Post,
  ): Promise<Post> {
    return this.postsService.create(req.user, post);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':slug')
  async update(
    @Param('slug') slug: string,
    @Request() req: { user: User },
    @Body() post: Post,
  ): Promise<Post> {
    return this.postsService.update(slug, req.user, post);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':slug')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('slug') slug: string,
    @Request() req: { user: User },
  ): Promise<void> {
    try {
      await this.postsService.remove(slug, req.user);
    } catch (exception) {
      throw exception;
    }
  }
}
