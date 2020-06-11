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

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Post> {
    return this.postsService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @HttpPost()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req: { user: User }, @Body() post: Post): Promise<Post> {
    return this.postsService.create(req.user, post);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Request() req: { user: User },
    @Body() post: Post,
  ): Promise<Post> {
    return this.postsService.update(Number(id), req.user, post);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Request() req: { user: User },
  ): Promise<void> {
    await this.postsService.remove(Number(id), req.user);
  }
}
