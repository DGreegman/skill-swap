import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entity/offer.entity';
import { User } from '@/users/entity/user.entity';

@Module({
  controllers: [OfferController],
  providers: [OfferService],
  imports: [TypeOrmModule.forFeature([Offer, User])],
})
export class OfferModule {}
