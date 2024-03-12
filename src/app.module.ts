import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './config/data.source';
import { MatchesModule } from './matches/matches.module';
import { CategoriesModule } from './categories/categories.module';
import { ClientsModule } from './clients/clients.module';
import { BuyerPostsModule } from './buyer-posts/buyer-posts.module';
import { SellerPostsModule } from './seller-posts/seller-posts.module';
import { CampaignsModule } from './campaigns/campaigns.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true
    }),
    TypeOrmModule.forRoot({ ...DataSourceConfig }),
    UsersModule,
    CategoriesModule,
    ClientsModule,
    BuyerPostsModule,
    SellerPostsModule,
    MatchesModule,
    CampaignsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
