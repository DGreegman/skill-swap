import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from './orm.config';
import { UsersModule } from './users/users.module';
import { SkillModule } from './skill/skill.module';
import { UserskillModule } from './userskill/userskill.module';
import { OfferModule } from './offer/offer.module';
import { RequestModule } from './request/request.module';
import { MatchModule } from './match/match.module';
import { SessionModule } from './session/session.module';
import { MessageModule } from './message/message.module';
import { RatingModule } from './rating/rating.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
    }),
    UsersModule,
    SkillModule,
    UserskillModule,
    OfferModule,
    RequestModule,
    MatchModule,
    SessionModule,
    MessageModule,
    RatingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
