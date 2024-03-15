import { Module } from '@nestjs/common'
import { MatchesService } from './services/matches.service'
import { MatchesController } from './controllers/matches.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MatchesEntity } from './entities/matches.entity'
import { BuyerPostsEntity } from '../buyer-posts/entities/buyer-posts.entity'
import { SellerPostsEntity } from '../seller-posts/entities/seller-posts.entity'
import { CategoriesEntity } from '../categories/entities/categories.entity'
import { CampaignsEntity } from '../campaigns/entities/campaigns.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MatchesEntity,
      BuyerPostsEntity,
      SellerPostsEntity,
      CategoriesEntity,
      CampaignsEntity
    ])
  ],
  providers: [MatchesService],
  controllers: [MatchesController],
  exports: [TypeOrmModule.forFeature([MatchesEntity])]
})
export class MatchesModule { }
