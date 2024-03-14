// import { join } from "path";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

ConfigModule.forRoot({
  envFilePath: ".env"
})

// const configService = new ConfigService()

// const TestDataSourceConfig: DataSourceOptions = {
//   type: 'postgres',
//   host: configService.get("TEST_DB_HOST"),
//   port: configService.get("TEST_DB_PORT"),
//   username: configService.get("TEST_DB_USER"),
//   password: configService.get("TEST_DB_PASSWORD"),
//   database: configService.get("TEST_DB_NAME"),
//   entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
//   migrations: [__dirname + '/../migrations/*{.ts,.js}'],
//   synchronize: false,
//   migrationsRun: true,
//   logging: false,
//   namingStrategy: new SnakeNamingStrategy(),
// }

// const DevDataSourceConfig: DataSourceOptions = {
//   type: 'postgres',
//   host: configService.get("DEV_DB_HOST"),
//   port: configService.get("DEV_DB_PORT"),
//   username: configService.get("DEV_DB_USER"),
//   password: configService.get("DEV_DB_PASSWORD"),
//   database: configService.get("DEV_DB_NAME"),
//   entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
//   migrations: [__dirname + '/../migrations/*{.ts,.js}'],
//   synchronize: false,
//   migrationsRun: true,
//   logging: false,
//   namingStrategy: new SnakeNamingStrategy(),
// }

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
  migrationsRun: true,
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

// export const DataSourceConfig: DataSourceOptions =
//   process.env.NODE_ENV === "production"
//     ? ProdDataSourceConfig
//     : process.env.NODE_ENV === "development"
//       ? DevDataSourceConfig
//       : TestDataSourceConfig

export const AppDS = new DataSource(ProdDataSourceConfig)