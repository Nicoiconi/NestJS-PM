import { Module } from '@nestjs/common';
import { ClientsService } from './services/clients.service';
import { ClientsController } from './controllers/clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsEntity } from './entities/clients.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientsEntity])
  ],
  providers: [ClientsService],
  controllers: [ClientsController]
})
export class ClientsModule { }
