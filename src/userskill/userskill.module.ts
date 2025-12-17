import { Module } from '@nestjs/common';
import { UserskillService } from './userskill.service';
import { UserskillController } from './userskill.controller';
import { Userskill } from './entity/userskill.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from '@/skill/entity/skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Userskill]), TypeOrmModule.forFeature([Skill])],
  controllers: [UserskillController],
  providers: [UserskillService],
})
export class UserskillModule { }
