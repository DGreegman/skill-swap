import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from './entity/request.entity';
import { Repository } from 'typeorm';
import { RequestDto } from './entity/dto/request.dto';
import { Skill } from '@/skill/entity/skill.entity';

@Injectable()
export class RequestService {
    constructor(
        @InjectRepository(Request)
        private readonly requestRepository: Repository<Request>,
        @InjectRepository(Skill)
        private readonly skillRepository: Repository<Skill>,
    ) { }

    async createRequest(userId: string, skillId: string, request: RequestDto): Promise<Request> {
        const existingSkill = await this.skillRepository.findOne({ where: { id: skillId } });
        if (!existingSkill) {
            throw new NotFoundException('Skill not found');
        }
        const newRequest = this.requestRepository.create({
            ...request,
            userId,
            skillId,
        });
        return await this.requestRepository.save(newRequest);
    }

    async getAllRequests(): Promise<Request[]> {
        return await this.requestRepository.find();
    }

    async getRequestById(id: string): Promise<Request> {
        const request = await this.requestRepository.findOne({ where: { id } });
        if (!request) {
            throw new NotFoundException('Request not found');
        }
        return request;
    }

    async updateRequest(id: string, request: RequestDto): Promise<Request> {
        const existingRequest = await this.requestRepository.findOne({ where: { id } });
        if (!existingRequest) {
            throw new NotFoundException('Request not found');
        }
        const updatedRequest = this.requestRepository.create({
            ...existingRequest,
            ...request,
        });
        return await this.requestRepository.save(updatedRequest);
    }

    async deleteRequest(id: string): Promise<void> {
        const existingRequest = await this.requestRepository.findOne({ where: { id } });
        if (!existingRequest) {
            throw new NotFoundException('Request not found');
        }
        await this.requestRepository.delete(id);
    }
}
