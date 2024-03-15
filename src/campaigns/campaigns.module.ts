import { Module } from '@nestjs/common'
import { CampaignsService } from './services/campaigns.service'
import { CampaignsController } from './controllers/campaigns.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CampaignsEntity } from './entities/campaigns.entity'
import { BuyerPostsModule } from '../buyer-posts/buyer-posts.module'
import { SellerPostsModule } from '../seller-posts/seller-posts.module'
import { MatchesModule } from '../matches/matches.module'
import { BuyerPostsService } from '../buyer-posts/services/buyer-posts.service'
import { SellerPostsService } from '../seller-posts/services/seller-posts.service'
import { MatchesService } from '../matches/services/matches.service'
import { ClientsEntity } from '../clients/entities/clients.entity'
import { CategoriesEntity } from '../categories/entities/categories.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([CampaignsEntity]),
    BuyerPostsModule,
    SellerPostsModule,
    MatchesModule,
    ClientsEntity,
    CategoriesEntity
  ],
  providers: [
    CampaignsService,
    BuyerPostsService,
    SellerPostsService,
    MatchesService
  ],
  controllers: [CampaignsController],
  exports: [TypeOrmModule.forFeature([CampaignsEntity])]
})
export class CampaignsModule { }
