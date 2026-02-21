import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferDTO, UpdateOfferDTO } from './entity/dto/offer.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Offer')
@Controller('offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @ApiOperation({ summary: 'Find all offers' })
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.offerService.findAll();
  }

  @ApiOperation({ summary: 'Find one offer' })
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offerService.findOne(id);
  }

  @ApiOperation({ summary: 'Create one offer' })
  @ApiBearerAuth()
  @Post()
  create(@Body() offerDto: OfferDTO, @Req() req) {
    return this.offerService.createOffer(req.user.id, offerDto);
  }

  @ApiOperation({ summary: 'Delete one offer' })
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.offerService.deleteOffer(req.user.id, id);
  }

  @ApiOperation({ summary: 'Update one offer' })
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() offerDto: UpdateOfferDTO, @Req() req) {
    return this.offerService.updateOffer(req.user.id, id, offerDto);
  }
}
