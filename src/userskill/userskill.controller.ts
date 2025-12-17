import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { UserskillService } from './userskill.service';
import { UserSkillDto } from './dto/user-skill.dto';
import { Userskill } from './entity/userskill.entity';
import { ApiAcceptedResponse, ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';


@ApiTags('UserSkill')
@Controller('userskill')
export class UserskillController {
  constructor( private readonly userskillService: UserskillService) { }

   @ApiOperation({ summary: 'Create a new skill' })
   @ApiAcceptedResponse({ type: UserSkillDto })
   @ApiBearerAuth()
   @ApiResponse({ status: 201, description: 'Skill created' })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 404, description: 'Skill not found' })
   @Post()
   async createUserskill(@Body() userskill: UserSkillDto, @Req() req): Promise<Userskill> {
       return this.userskillService.createUserskill(req.user.id, userskill);
     } 

    @ApiOperation({ summary: 'Find all skills' })
    @ApiAcceptedResponse({ type: UserSkillDto, isArray: true })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'List of all skills' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'No skills found' })
    @Get()
    async findAllUserskills(): Promise<Userskill[]> {
      return this.userskillService.getAllUserskills();
    }

    @ApiOperation({ summary: 'Find all skills' })
    @ApiAcceptedResponse({ type: UserSkillDto, isArray: true })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'List of all skills' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'No skills found' })
    @Put('/:id/:skillId')
    async updateSkill(@Body() userskill: UserSkillDto, @Param('skillId') skillId: string, @Param('id') id: string, @Req() req): Promise<Userskill> {
      return this.userskillService.updateUserSkillById(id,skillId, req.user.id, userskill);
    }

    @ApiOperation({ summary: 'Find all skills associated to the logged in user' })
    @ApiAcceptedResponse({ type: UserSkillDto, isArray: true })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'List of all skills' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'No skills found' })
    @Get('/:id')
    async getUserSkill(@Param('id') id: string, @Req() req): Promise<Userskill[]> {
      return this.userskillService.getUserSkillByUserId(id, req.user.id);
    }

    @ApiOperation({summary: "Delete a user's skill, you can only delete your own skill"})
    @ApiBearerAuth()
     @ApiResponse({ status: 200, description: 'List of all skills' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'No skills found' })
    @Delete('/:id')

    async deleteSkill(@Param('id') id: string, @Req() req): Promise<void> {
      return this.userskillService.deleteUserSkillByUserId(id, req.user.id);
    }

}
 