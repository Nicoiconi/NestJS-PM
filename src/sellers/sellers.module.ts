import { Module } from '@nestjs/common';
import { SellersService } from './services/sellers.service';
import { SellersController } from './controllers/sellers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellersEntity } from './entities/sellers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SellersEntity])
  ],
  providers: [SellersService],
  controllers: [SellersController]
})
export class SellersModule {}
