import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { ProdDataSourceConfig } from './config/data.source';
import { MatchesModule } from './matches/matches.module';
import { CategoriesModule } from './categories/categories.module';
import { ClientsModule } from './clients/clients.module';
import { BuyerPostsModule } from './buyer-posts/buyer-posts.module';
import { SellerPostsModule } from './seller-posts/seller-posts.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { SnakeNamingStrategy } from "typeorm-naming-strategies"

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PROD_DB_HOST,
      port: parseInt(process.env.PROD_DB_PORT),
      username: process.env.PROD_DB_USER,
      password: process.env.PROD_DB_PASSWORD,
      database: process.env.PROD_DB_NAME,
      entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      synchronize: false,
      logging: false,
      namingStrategy: new SnakeNamingStrategy(),
      ssl: process.env.POSTGRES_SSL === "true",
      extra: {
        ssl:
          process.env.POSTGRES_SSL === "true"
            ? {
              rejectUnauthorized: false,
            }
            : null,
      }
    }),
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
