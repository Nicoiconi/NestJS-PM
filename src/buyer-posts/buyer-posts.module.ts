import { Module } from '@nestjs/common';
import { BuyerPostsController } from './controllers/buyer-posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerPostsEntity } from './entities/buyer-posts.entity';
import { BuyerPostsService } from './services/buyer-posts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BuyerPostsEntity])
  ],
  providers: [BuyerPostsService],
  controllers: [BuyerPostsController],
  exports: [TypeOrmModule.forFeature([BuyerPostsEntity])]
})
export class BuyerPostsModule {}
