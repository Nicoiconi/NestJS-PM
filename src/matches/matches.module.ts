import { Module } from '@nestjs/common';
import { MatchesService } from './services/matches.service';
import { MatchesController } from './controllers/matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesEntity } from './entities/matches.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatchesEntity])
  ],
  providers: [MatchesService],
  controllers: [MatchesController],
  exports: [TypeOrmModule.forFeature([MatchesEntity])]
})
export class MatchesModule {}
