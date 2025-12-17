import { Injectable, NotFoundException } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entity/skill.entity';
import { Repository } from 'typeorm';
import { SkillDto } from './entity/dto/skill.dto';


@Injectable()
export class SkillService {
    constructor(@InjectRepository(Skill) private readonly skillRepository: Repository<Skill>) { }


    async createSkill(skillDto: SkillDto): Promise<Skill> {
        const skill = this.skillRepository.create(skillDto);
        return this.skillRepository.save(skill);
    }

    async createSkills(skillDto: SkillDto[]): Promise<Skill[]> {
        const skills = this.skillRepository.create(skillDto);
        return this.skillRepository.save(skills);
    }
    
    async findAll(): Promise<Skill[]> {
        const skills = await this.skillRepository.find();
        if (!skills || skills.length === 0) {
            throw new NotFoundException('No skills found Yet, Create a skill and try again');
        }
        return skills;
    }

    async findOne(id: string): Promise<Skill> {
        if (!isUUID(id)) {
            throw new NotFoundException(`The ID-${id} you provided is Invalid`);
        }
        const skill = await this.skillRepository.findOne({ where: { id } });
        if (!skill) {
            throw new NotFoundException(`No Skill with this ID-${id} found`);
        }
        return skill;
    }


}
