import { Controller, Req } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestDto } from './entity/dto/request.dto';
import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Request } from './entity/request.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Request')
@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new request' })
  @ApiBearerAuth()
  async createRequest(@Body() request: RequestDto, @Req() req): Promise<Request> {
    return await this.requestService.createRequest(req.user.id, request.skillId, request);
  }

  @Get()
  async getAllRequests(): Promise<Request[]> {
    return await this.requestService.getAllRequests();
  }

  @Get(':id')
  async getRequestById(@Param('id') id: string): Promise<Request> {
    return await this.requestService.getRequestById(id);
  }

  @Put(':id')
  async updateRequest(@Param('id') id: string, @Body() request: RequestDto): Promise<Request> {
    return await this.requestService.updateRequest(id, request);
  }

  @Delete(':id')
  async deleteRequest(@Param('id') id: string): Promise<void> {
    return await this.requestService.deleteRequest(id);
  }
}
