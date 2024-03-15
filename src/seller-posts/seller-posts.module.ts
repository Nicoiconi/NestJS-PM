import { Module } from '@nestjs/common'
import { SellerPostsController } from './controllers/seller-posts.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SellerPostsEntity } from './entities/seller-posts.entity'
import { SellerPostsService } from './services/seller-posts.service'
import { ClientsEntity } from '../clients/entities/clients.entity'
import { CategoriesEntity } from '../categories/entities/categories.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SellerPostsEntity,
      ClientsEntity,
      CategoriesEntity
    ])
  ],
  providers: [SellerPostsService],
  controllers: [SellerPostsController],
  exports: [TypeOrmModule.forFeature([SellerPostsEntity])]
})
export class SellerPostsModule { }
