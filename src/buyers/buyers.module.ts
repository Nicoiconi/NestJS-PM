import { Module } from '@nestjs/common';
import { BuyersService } from './services/buyers.service';
import { BuyersController } from './controllers/buyers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyersEntity } from './entities/buyers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BuyersEntity])
  ],
  providers: [BuyersService],
  controllers: [BuyersController]
})
export class BuyersModule {}
