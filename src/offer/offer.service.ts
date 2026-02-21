import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Offer } from './entity/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OfferDTO, UpdateOfferDTO } from './entity/dto/offer.dto';
import { isUUID } from 'class-validator';
import { User } from '@/users/entity/user.entity';

@Injectable()
export class OfferService {
    constructor(@InjectRepository(Offer) private readonly offerRepository: Repository<Offer>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
) {}

    async findAll(): Promise<Offer[]> {
        return await this.offerRepository.find();
    }

    async findOne(id: string): Promise<Offer> {
        const offer = await this.offerRepository.findOne({where: {id}});
        if (!offer) {
            throw new NotFoundException(`No Offer with this ID-${id} found`);
        }
        return offer;
    }

    async createOffer(userId:string, offerDto: OfferDTO): Promise<Offer> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException(`No User with this ID-${userId} found`);
        }
        const offer = this.offerRepository.create({
            ...offerDto,
            userId
        });
        return await this.offerRepository.save(offer);
    }

    async deleteOffer(userId:string, id: string): Promise<void> {
        if (!isUUID(id)) {
            throw new NotFoundException(`The ID-${id} you provided is Invalid`);
        }
        const offerEntity = await this.offerRepository.findOneBy({ id });
        if (!offerEntity) { 
            throw new NotFoundException(`No Offer with this ID-${id} found`);
        }
        if (offerEntity.userId !== userId) {
            throw new NotFoundException(`You are not authorized to delete this offer`);
        }
        await this.offerRepository.delete(id);
    }

    async updateOffer(userId:string, id: string, offerDto: UpdateOfferDTO): Promise<Offer> {
        if (!isUUID(id)) {
            throw new NotFoundException(`The ID-${id} you provided is Invalid`);
        }
        const offerEntity = await this.offerRepository.findOneBy({ id });
        if (!offerEntity) {
            throw new NotFoundException(`No Offer with this ID-${id} found`);
        }
        if (offerEntity.userId !== userId) {
            throw new NotFoundException(`You are not authorized to update this offer`);
        }
        return this.offerRepository.save({
            ...offerEntity,
            ...offerDto
        });
    }
}
