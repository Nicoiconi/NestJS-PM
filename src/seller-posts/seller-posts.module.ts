import { Module } from '@nestjs/common';
import { SellerPostsController } from './controllers/seller-posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerPostsEntity } from './entities/seller-posts.entity';
import { SellerPostsService } from './services/seller-posts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SellerPostsEntity])
  ],
  providers: [SellerPostsService],
  controllers: [SellerPostsController]
})
export class SellerPostsModule {}
