import { Module } from '@nestjs/common'
import { BuyerPostsController } from './controllers/buyer-posts.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BuyerPostsEntity } from './entities/buyer-posts.entity'
import { BuyerPostsService } from './services/buyer-posts.service'
import { ClientsEntity } from '../clients/entities/clients.entity'
import { CategoriesEntity } from '../categories/entities/categories.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BuyerPostsEntity,
      ClientsEntity,
      CategoriesEntity
    ])
  ],
  providers: [BuyerPostsService],
  controllers: [BuyerPostsController],
  exports: [TypeOrmModule.forFeature([BuyerPostsEntity])]
})
export class BuyerPostsModule { }
