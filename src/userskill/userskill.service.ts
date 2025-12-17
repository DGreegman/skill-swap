import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Userskill } from './entity/userskill.entity';
import { Skill } from '@/skill/entity/skill.entity';
import { Repository } from 'typeorm';
import { UserSkillDto } from './dto/user-skill.dto';
import { isUUID } from 'class-validator';



@Injectable()
export class UserskillService {
    constructor(
        @InjectRepository(Userskill) private readonly userskillRepository: Repository<Userskill>,
        @InjectRepository(Skill) private readonly skillRepository: Repository<Skill>,
    ) { }

    async createUserskill(userId: string, userskill: UserSkillDto): Promise<Userskill> {
        if (!isUUID(userId)) {
            throw new BadRequestException(`The ID-${userId} you provided is Invalid`);
        }
        if (!isUUID(userskill.skillId)) {
            throw new BadRequestException(`The ID-${userskill.skillId} you provided is Invalid`);
        }
        const skillEntity = await this.skillRepository.findOneBy({ id: userskill.skillId });
        if (!skillEntity) {
            throw new NotFoundException(`No Skill with this ID-${userskill.skillId} found`);
        }  
        const userskillEntityExists = await this.userskillRepository.findOneBy({ userId, skillId: userskill.skillId });
        if (userskillEntityExists) {
            throw new BadRequestException('User with this Skill already Exists');
        }
        const userskillEntity = this.userskillRepository.create({
            ...userskill,
            userId
        });
        return this.userskillRepository.save(userskillEntity);
    }

    async getAllUserskills(): Promise<Userskill[]> {
        return this.userskillRepository
            .createQueryBuilder('userskill')
            .leftJoinAndSelect('userskill.skill', 'skill')
            .leftJoinAndSelect('userskill.user', 'user')
            .select([
                'userskill',
                'skill',
                'user.id',
                'user.name',
                'user.email',
                'user.avatarUrl',
                'user.location',
                'user.rating'
            ])
            .getMany();
    }

    async getUserSkillById(id: string): Promise<Userskill | null> {

        if (!isUUID(id)) {
            throw new NotFoundException(`The ID-${id} you provided is Invalid`);
        }
        const userskillEntity = await this.userskillRepository.findOneBy({ id });
        if (!userskillEntity) {
            throw new NotFoundException(`No UserSkill with this ID-${id} found`);
        }
        return userskillEntity;
    }

    async updateUserSkillById(id: string, skillId: string, userId: string, userskill: UserSkillDto): Promise<Userskill> {
        if (!isUUID(id)) {
            throw new NotFoundException(`The ID-${id} you provided is Invalid`);
        }
        const userskillEntity = await this.userskillRepository.findOneBy({ id });
        if (!userskillEntity) {
            throw new NotFoundException(`No UserSkill with this ID-${id} found`);
        }
        if (userId !== userskillEntity.userId) {
            throw new UnauthorizedException('You are not authorized to update this UserSkill');
        }
        const skillEntity = await this.skillRepository.findOneBy({ id: skillId });
        if (!skillEntity) {
            throw new NotFoundException(`No Skill with this ID-${skillId} found`);
        }
        return this.userskillRepository.save({
            ...userskillEntity,
            ...userskill,
            skillId
        });
    }



    // get user's skill using user's Id and current logged in user's Id

    async getUserSkillByUserId(userId: string, currentUserId: string): Promise<Userskill[]> {
        if (!isUUID(userId)) {
            throw new NotFoundException(`The ID-${userId} you provided is Invalid`);
        }

        if (userId !== currentUserId) {
            throw new UnauthorizedException('You are not authorized to view this UserSkill');
        }
        return await this.userskillRepository.find({ where: { userId } });
    }


    // delete user's skill with user's ID, user can delete only his/her skill

    async deleteUserSkillByUserId(userId:string, currentUserId:string): Promise<void> {
        if (!isUUID(userId)) {
            throw new NotFoundException(`The ID-${userId} you provided is Invalid`);
        }

        if (userId !== currentUserId) {
            throw new UnauthorizedException('You are not authorized to delete this UserSkill');
        }
        await this.userskillRepository.delete({ userId });
    }

}
