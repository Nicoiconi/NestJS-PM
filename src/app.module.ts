import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './config/data.source';
// import { BuyersModule } from './buyers/buyers.module';
// import { SellersModule } from './sellers/sellers.module';
// import { PostsModule } from './posts/posts.module';
// import { BuyerMatchesModule } from './buyer-matches/buyer-matches.module';
// import { SellerMatchesModule } from './seller-matches/seller-matches.module';
import { MatchesModule } from './matches/matches.module';
import { CategoriesModule } from './categories/categories.module';
import { ClientsModule } from './clients/clients.module';
import { BuyerPostsModule } from './buyer-posts/buyer-posts.module';
import { SellerPostsModule } from './seller-posts/seller-posts.module';
import { SalesModule } from './sales/sales.module';
import { PurchasesModule } from './purchases/purchases.module';

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
    SalesModule,
    PurchasesModule,
    
    // BuyerMatchesModule,
    // SellerMatchesModule,
    // Client replace Buyers & Sellers
    // BuyersModule,
    // SellersModule,
    // buyer & seller for each
    // PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
