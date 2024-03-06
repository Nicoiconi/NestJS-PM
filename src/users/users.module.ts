import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersEntity } from './entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity])
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule]
})
export class UsersModule { }
