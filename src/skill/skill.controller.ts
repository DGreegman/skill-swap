import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { SkillService } from './skill.service';
import { ApiAcceptedResponse, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkillDto } from './entity/dto/skill.dto';
import { Public } from '@/users/decorators/auth.decorator';


@ApiTags('Skills')
@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new skill' })
  @ApiAcceptedResponse({ type: SkillDto })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Skill created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  createSkill(@Body() skillDto: SkillDto) {
    return this.skillService.createSkill(skillDto);
  }
  @Post('createSkills')
  @ApiOperation({ summary: 'Create multiple skills' })
  @ApiAcceptedResponse({ type: SkillDto, isArray: true })
  @ApiBearerAuth()
  @Public()
  @ApiResponse({ status: 201, description: 'Skills created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  createSkills(@Body() skillDto: SkillDto[]) {
    return this.skillService.createSkills(skillDto);
  }
  
  @Get()
  @ApiOperation({ summary: 'Find all skills' })
  @ApiAcceptedResponse({ type: SkillDto, isArray: true })
  @ApiBearerAuth()
  @Public()
  @ApiResponse({ status: 200, description: 'List of all skills' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'No skills found' })
  findAll() {
    return this.skillService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one skill with id' })
  @ApiAcceptedResponse({ type: SkillDto })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Skill found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  findOne(@Param('id') id: string) {
    return this.skillService.findOne(id);
  }
}
