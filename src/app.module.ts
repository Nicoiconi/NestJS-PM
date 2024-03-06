import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './config/data.source';
import { BuyersModule } from './buyers/buyers.module';
import { SellersModule } from './sellers/sellers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true
    }),
    TypeOrmModule.forRoot({ ...DataSourceConfig }),
    UsersModule,
    BuyersModule,
    SellersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
