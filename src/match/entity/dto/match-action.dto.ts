import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AcceptMatchDto {
  @ApiPropertyOptional({ example: 'I can start this weekend.', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string; // Optional message to the other user
}

export class RejectMatchDto {
  @ApiPropertyOptional({ example: 'Timing no longer works for me.', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string; // Optional reason for rejection
}
