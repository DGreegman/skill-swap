import { Module } from '@nestjs/common';
import { UserskillService } from './userskill.service';
import { UserskillController } from './userskill.controller';

@Module({
  controllers: [UserskillController],
  providers: [UserskillService],
})
export class UserskillModule {}
