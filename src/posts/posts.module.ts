import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './post.entity';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: join(__dirname, '..', '..', 'uploads'),
          filename: (req, file, callback) => {
            const hash = randomBytes(6).toString('hex');

            const fileName = `${hash}-${file.originalname}`;

            return callback(null, fileName);
          },
        }),
      }),
    }),
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
