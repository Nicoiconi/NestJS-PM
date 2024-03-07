import { Module } from '@nestjs/common';
import { PostsService } from './services/posts.service';
import { PostsController } from './controllers/posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsEntity } from './entities/posts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostsEntity])
  ],
  providers: [PostsService],
  controllers: [PostsController]
})
export class PostsModule {}
