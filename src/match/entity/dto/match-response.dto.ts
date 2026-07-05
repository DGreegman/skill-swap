import { Expose, Type } from "class-transformer";
import { MatchStatus } from "../match.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class MatchSkillDto {
  @ApiProperty({ example: 'b8ab1ed0-4df4-4f4d-9a8b-3fcac8f4a7fd' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'JavaScript' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'Programming' })
  @Expose()
  category: string;

  @ApiPropertyOptional({ example: 'Core language for web development' })
  @Expose()
  description?: string;
}

export class MatchUserDto {
  @ApiProperty({ example: 'f4f93b58-810f-4d45-b7f8-8cf8f62f05f5' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Jane Doe' })
  @Expose()
  name: string;

  @ApiProperty({ example: 4.6 })
  @Expose()
  rating: number;

  @ApiProperty({ example: 18 })
  @Expose()
  totalRatings: number;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @Expose()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'Frontend engineer and mentor' })
  @Expose()
  bio?: string;

  // Hidden: email, password, refreshToken
}


export class MatchScoreBreakdownDto {
    @ApiProperty({ example: 40 })
    @Expose()
    skillFit: number 

    @ApiProperty({ example: 20 })
    @Expose()
    availability: number 

    @ApiProperty({ example: 25 })
    @Expose()
    rating: number;

    @ApiProperty({ example: 10 })
    @Expose()
    recency: number;

    
}

export class MatchOfferDto {
    @ApiProperty({ example: '8ce938aa-4b70-4a69-8619-2a7f5a9a1431' })
    @Expose()
    id: string;

    @ApiProperty({ example: 'Can teach React fundamentals' })
    @Expose()
    description: string;

    @ApiProperty({ example: 'weekdays_evening' })
    @Expose()
    availability: string;

    @ApiProperty({ type: MatchSkillDto })
    @Expose()
    @Type(() => MatchSkillDto)
    skill: MatchSkillDto;

    @ApiProperty({ type: MatchUserDto })
    @Expose()
    @Type(() => MatchUserDto)
    user: MatchUserDto;
    
}

export class MatchRequestDto {
  @ApiProperty({ example: '2f670a6e-1138-48b6-9348-b6b4558a303d' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Need help with React state management' })
  @Expose()
  description: string;

  @ApiProperty({ example: 'weekends_morning' })
  @Expose()
  preferredTimeSlots: string;

  @ApiProperty({ example: 'medium' })
  @Expose()
  urgencyLevel: string;

  @ApiProperty({ type: MatchSkillDto })
  @Expose()
  @Type(() => MatchSkillDto)
  skill: MatchSkillDto;

  @ApiProperty({ type: MatchUserDto })
  @Expose()
  @Type(() => MatchUserDto)
  user: MatchUserDto;
}




export class MatchResponseDto {
  @ApiProperty({ example: '97cfd31f-6d10-4d6f-b4b3-aa1f0264ddf2' })
  @Expose()
  id: string;

  @ApiProperty({ example: 82 })
  @Expose()
  matchScore: number;

  @ApiProperty({ enum: MatchStatus, example: MatchStatus.PENDING })
  @Expose()
  status: MatchStatus;

  @ApiProperty({ type: String, format: 'date-time', example: '2026-04-10T10:00:00.000Z' })
  @Expose()
  expiresAt: Date;

  @ApiProperty({ type: String, format: 'date-time', example: '2026-04-03T10:00:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ type: MatchOfferDto })
  @Expose()
  @Type(() => MatchOfferDto)
  offer: MatchOfferDto;

  @ApiProperty({ type: MatchRequestDto })
  @Expose()
  @Type(() => MatchRequestDto)
  request: MatchRequestDto;

  @ApiProperty({ type: MatchUserDto })
  @Expose()
  @Type(() => MatchUserDto)
  offeror: MatchUserDto;

  @ApiProperty({ type: MatchUserDto })
  @Expose()
  @Type(() => MatchUserDto)
  requestor: MatchUserDto;

  // Optional: Include score breakdown for transparency
  @ApiPropertyOptional({ type: MatchScoreBreakdownDto })
  @Expose()
  @Type(() => MatchScoreBreakdownDto)
  scoreBreakdown?: MatchScoreBreakdownDto;
}
