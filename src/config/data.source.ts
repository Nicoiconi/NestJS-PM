import { ConfigModule } from "@nestjs/config"
import { DataSource, DataSourceOptions } from "typeorm"
import { SnakeNamingStrategy } from "typeorm-naming-strategies"

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
}

export const AppDS = new DataSource(ProdDataSourceConfig)