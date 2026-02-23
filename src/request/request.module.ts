import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from './entity/request.entity';
import { Skill } from '@/skill/entity/skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Request, Skill])],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
