import { IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { MatchStatus } from '../match.entity';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetMatchesQueryDto {
  @ApiPropertyOptional({ enum: MatchStatus, description: 'Filter matches by status' })
  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus;

  @ApiPropertyOptional({ minimum: 0, maximum: 100, example: 50, description: 'Minimum match score' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  minScore?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 50, example: 10, default: 10, description: 'Maximum number of records to return' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @ApiPropertyOptional({ minimum: 0, example: 0, default: 0, description: 'Pagination offset' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
