import { ConfigModule, ConfigService } from "@nestjs/config";
import { BuyerPostsEntity } from "src/buyer-posts/entities/buyer-posts.entity";
import { CampaignsEntity } from "src/campaigns/entities/campaigns.entity";
import { ClientsEntity } from "src/clients/entities/clients.entity";
import { MatchesEntity } from "src/matches/entities/matches.entity";
import { SellerPostsEntity } from "src/seller-posts/entities/seller-posts.entity";
import { UsersEntity } from "src/users/entities/users.entity";
import { DataSource, DataSourceOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

ConfigModule.forRoot({
  envFilePath: ".env"
})

export const ProdDataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.PROD_DB_HOST,
  port: parseInt(process.env.PROD_DB_PORT),
  username: process.env.PROD_DB_USER,
  password: process.env.PROD_DB_PASSWORD,
  database: process.env.PROD_DB_NAME,
  // entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
  // migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
  entities: [
    ClientsEntity,
    BuyerPostsEntity,
    SellerPostsEntity,
    MatchesEntity,
    CampaignsEntity,
    UsersEntity
  ],
  // migrationsRun: true,
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
}

export const AppDS = new DataSource(ProdDataSourceConfig)