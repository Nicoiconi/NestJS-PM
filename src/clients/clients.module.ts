import { Module } from '@nestjs/common'
import { ClientsService } from './services/clients.service'
import { ClientsController } from './controllers/clients.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClientsEntity } from './entities/clients.entity'
import { BuyerPostsEntity } from '../buyer-posts/entities/buyer-posts.entity'
import { SellerPostsEntity } from '../seller-posts/entities/seller-posts.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClientsEntity, 
      BuyerPostsEntity,
      SellerPostsEntity
    ])
  ],
  providers: [ClientsService],
  controllers: [ClientsController]
})
export class ClientsModule { }
