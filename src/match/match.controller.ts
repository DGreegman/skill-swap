import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Query, Req } from '@nestjs/common';
import { MatchService } from './match.service';
import { AcceptMatchDto, GenerateMatchesForOfferDto, GetMatchesQueryDto, MatchResponseDto, RejectMatchDto } from './entity/dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Match')
@ApiBearerAuth()
@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  /* 
    * Get match suggestion for lthe logged in user based on their offers and requests. 
    * This endpoint will return a list of potential matches with a match score, sorted by best fit.
    * GET /matches/suggestions?status=pending&minScore=50&limit=10
  */

  @Get('suggestions')
  @ApiOperation({ summary: 'Get match suggestions for the logged-in user' })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'accepted', 'rejected', 'expired'] })
  @ApiQuery({ name: 'minScore', required: false, type: Number, example: 50 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
  @ApiOkResponse({ description: 'List of suggested matches', type: MatchResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getSuggestions(@Req() req, @Query() query: GetMatchesQueryDto): Promise<MatchResponseDto[]> {

      const userId = req.user.id; // Assuming user ID is available in the request object after authentication
      return this.matchService.getMatchSuggestionForUser(userId, query);

  }

   /**
   * Generate matches for a specific offer
   * POST /matches/generate/offer/:offerId
   */
  @Get('generate/offer/:offerId')
  @ApiOperation({ summary: 'Generate matches for a specific offer' })
  @ApiParam({ name: 'offerId', type: String, format: 'uuid' })
  @ApiBody({ type: GenerateMatchesForOfferDto, required: false })
  @ApiOkResponse({ description: 'Generated matches', type: MatchResponseDto, isArray: true })
  @ApiBadRequestResponse({ description: 'Invalid offer id or offer not active' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async generateForOffer(@Param('offerId', ParseUUIDPipe) offerId: string, @Body() dto:GenerateMatchesForOfferDto): Promise<MatchResponseDto[]> {
    return this.matchService.generateMatchesForRequest(offerId, dto);
  }

  /**
   * Generate matches for a specific request
   * POST /matches/generate/request/:requestId
   */
  @Get('generate/request/:requestId')
  @ApiOperation({ summary: 'Generate matches for a specific request' })
  @ApiParam({ name: 'requestId', type: String, format: 'uuid' })
  @ApiBody({ type: GenerateMatchesForOfferDto, required: false })
  @ApiOkResponse({ description: 'Generated matches', type: MatchResponseDto, isArray: true })
  @ApiBadRequestResponse({ description: 'Invalid request id or request not active' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async generateForRequest(@Param('requestId', ParseUUIDPipe) requestId: string, @Body() dto:GenerateMatchesForOfferDto): Promise<MatchResponseDto[]> {
    return this.matchService.generateMatchesForRequest(requestId, dto);
  }


  /**
   * Get a single match by ID
   * GET /matches/:id
  */

  @Get(':id')
  @ApiOperation({ summary: 'Get a single match by id' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiOkResponse({ description: 'Match details', type: MatchResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid match id' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getMatchById(@Param('id', ParseUUIDPipe) id: string, @Req() req): Promise<MatchResponseDto> {
    const userId = req.user.id; // Assuming user ID is available in the request object after authentication
    return this.matchService.getMatchById(id, userId);
  }

  /**
   * Accept a match
   * POST /matches/:id/accept
   */

  @Post(':id/accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept a match' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiBody({ type: AcceptMatchDto, required: false })
  @ApiOkResponse({ description: 'Accepted match', type: MatchResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid action or invalid match id' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async acceptMatch(@Param('id', ParseUUIDPipe) id: string, @Req() req, @Body() dto:AcceptMatchDto): Promise<MatchResponseDto> {
    const userId = req.user.id; // Assuming user ID is available in the request object after authentication
    return this.matchService.acceptMatch(id, userId, dto);
  }

  /**
   * Reject a match
   * POST /matches/:id/reject
   */

  @Post(':id/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject a match' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiBody({ type: RejectMatchDto, required: false })
  @ApiOkResponse({ description: 'Rejected match', type: MatchResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid action or invalid match id' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async rejectMatch(@Param('id', ParseUUIDPipe) id: string, @Req() req, @Body() dto:RejectMatchDto): Promise<MatchResponseDto> {

    const userId = req.user.id; // Assuming user ID is available in the request object after authentication
    return this.matchService.rejectMatch(id, userId, dto);

  }
}
