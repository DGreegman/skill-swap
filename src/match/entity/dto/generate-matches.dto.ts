import {  IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateMatchesDto {
  @ApiPropertyOptional({ example: 5, minimum: 1, maximum: 20, description: 'Maximum number of matches to generate' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  maxMatches?: number = 5; // Default to top 5 matches

  @ApiPropertyOptional({ example: 30, minimum: 0, maximum: 100, description: 'Minimum score threshold for generated matches' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  minScore?: number = 30; // Minimum match score to include
}

export class GenerateMatchesForOfferDto extends GenerateMatchesDto {
  // Inherits maxMatches and minScore
  // Can add offer-specific filters here if needed
}

export class GenerateMatchesForRequestDto extends GenerateMatchesDto {
  // Inherits maxMatches and minScore
  // Can add request-specific filters here if needed
}
