import { Controller } from '@nestjs/common';
import { UserskillService } from './userskill.service';

@Controller('userskill')
export class UserskillController {
  constructor(private readonly userskillService: UserskillService) {}
}
