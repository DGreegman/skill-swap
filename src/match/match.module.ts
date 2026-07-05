import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entity/match.entity';
import { Offer } from '@/offer/entity/offer.entity';
import { Request } from '@/request/entity/request.entity';

@Module({
  controllers: [MatchController],
  providers: [MatchService],
  imports: [TypeOrmModule.forFeature([Match, Offer, Request])], // Add your entities here when you create them
})
export class MatchModule {}
