import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Offer } from '@/offer/entity/offer.entity';
import { Request } from '@/request/entity/request.entity';
import { Match, MatchStatus } from './entity/match.entity';
import { LessThan, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AcceptMatchDto, GenerateMatchesForOfferDto, GetMatchesQueryDto, RejectMatchDto } from './entity/dto';
import { Cron, CronExpression } from '@nestjs/schedule';



interface MatchCandidate {
    offer: Offer;
    request: Request;
    matchScore: number;
    scoreBreakdown: {
        skillFit: number;
        availability: number;
        rating: number;
        recency: number;
    };
}

@Injectable()
export class MatchService {
    private readonly logger = new Logger(MatchService.name);

    constructor(
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
        @InjectRepository(Offer)
        private readonly offerRepository: Repository<Offer>,
        @InjectRepository(Request)
        private readonly requestRepository: Repository<Request>
    ){}

    /**
     * Generate matches for a specific request 
     */
        
    async generateMatchesForRequest(requestId: string, dto?:GenerateMatchesForOfferDto):Promise<Match[]>{
        const request = await this.requestRepository.findOne({
            where: {id: requestId},
            relations: {skill: true, user: true}
        })

        if(!request || !request.isActive){
            this.logger.warn(`Request ${requestId} not found or inactive`);
            throw new BadRequestException(`Request ${requestId} not found or inactive`);
        }

        const maxMatches = dto?.maxMatches || 5;
        const minScore = dto?.minScore || 30;

        const offers = await this.offerRepository.find({
            where: {
                skillId: request.skillId,
                isActive: true,
                userId: Not(request.userId) // Ensure offeror is not the same as requestor
            },
            relations: ['user', 'user.skills', 'skill']
        })

        if(offers.length === 0){
            this.logger.warn(`No offers found for request ${requestId}`);
            return [];
        }

        const candidates: MatchCandidate[] = offers.map(offer => ({
            offer,
            request,
            matchScore: this.calculateMatchScore(offer, request),
            scoreBreakdown: this.calculateScoreBreakdown(offer, request)
        }));

        // filter by minimum score
        const qualified = candidates.filter(c => c.matchScore >= minScore);

        qualified.sort((a, b) => b.matchScore - a.matchScore);

        // Take top N matches 
        const topMatches = qualified.slice(0, maxMatches);

        // create match records 
        const matches: Match[] = []; 

        for(const candidate of topMatches){
            const existingMatch = await this.matchRepository.findOne({
                where: {
                    offerId: candidate.offer.id,
                    requestId: candidate.request.id
                }
            })

            if(!existingMatch){
                const match = this.matchRepository.create({
                    offerId: candidate.offer.id,
                    requestId: candidate.request.id,
                    offerorId: candidate.offer.userId,
                    requestorId: candidate.request.userId,
                    matchScore: candidate.matchScore,
                    status: MatchStatus.PENDING,
                    expiresAt: this.calculateExpiryDate()
                })

                const savedMatch = await this.matchRepository.save(match);
                matches.push(savedMatch);

                this.logger.log(`Created match: Offer ${candidate.offer.id} <-> Request ${candidate.request.id} (Score: ${candidate.matchScore}`);
            }
        }
       

        return matches;
    }


    /*
    * Generate match for a specific offer 
    */

    async generateMatchesForOffer(offerId:string): Promise<Match[]>{
        const offer = await this.offerRepository.findOne({
            where: {id: offerId},
            relations: ['user', 'user.skills', 'skill']
        })

        if(!offer || !offer.isActive){
            this.logger.warn(`Offer ${offerId} not found or inactive`);
            throw new BadRequestException(`Offer ${offerId} not found or inactive`);
        }

        // get all requests that can be matched with this offer
        const requests = await this.requestRepository.find({
            where: {
                skillId: offer.skillId,
                isActive: true,
                userId: Not(offer.userId)
            },

            relations: ['user', 'skill']
        })

        if(requests.length === 0){
            this.logger.log(`No request found for offer ${offerId}`)
            return [];
        }

        // Calculate Scores

        const candidates: MatchCandidate[] = requests.map(request => ({
            offer,
            request,
            matchScore: this.calculateMatchScore(offer, request),
            scoreBreakdown: this.calculateScoreBreakdown(offer, request)
        }));

        candidates.sort((a, b) => b.matchScore - a.matchScore);

        const topMatches: Match[] = [];

        for(const candidate of topMatches){
            const existingMatch = await this.matchRepository.findOne({
                where: {
                    offerId: candidate.offer.id,
                    requestId: candidate.request.id
                }
            })

            if(!existingMatch){
                const match = this.matchRepository.create({
                    offerId: candidate.offer.id,
                    requestId: candidate.request.id,
                    offerorId: candidate.offer.userId,
                    requestorId: candidate.request.userId,
                    matchScore: candidate.matchScore,
                    status: MatchStatus.PENDING,
                    expiresAt: this.calculateExpiryDate()
                })

                const savedMatch = await this.matchRepository.save(match);
                topMatches.push(savedMatch);

                this.logger.log(`Created match: Offer ${candidate.offer.id} <-> Request ${candidate.request.id} (Score: ${candidate.matchScore})`);
            }
        }
        

        return topMatches;
    } 
    
    
    /* 
    
    * Daily CRON job to recalculate all matches 
    
    */

    @Cron(CronExpression.EVERY_DAY_AT_2AM)
    async reacalculateAllMatches(){
        this.logger.log('Starting daily match recalculation...');

        // get all active requests 
        const activeRequests = await this.requestRepository.find({
            where: {isActive: true}
        })

        let totalMaches = 0

        for(const request of activeRequests){
            // Recalculate match scores for each request
            try {
                const matches = await this.generateMatchesForRequest(request.id)
                totalMaches += matches.length; 
            } catch (error) {
                this.logger.error(`Error occurred while recalculating matches for request ${request.id}: ${error.message}`);
            }
        }
        this.logger.log(`Daily match recalculation completed. Total matches recalculated: ${totalMaches}`);
    }

    /* 
    * Calculate overall match score 
    */

    private calculateMatchScore(offer: Offer, request: Request): number {
        const breakdown = this.calculateScoreBreakdown(offer, request);
        return Math.round(
            breakdown.skillFit + 
            breakdown.availability +
            breakdown.rating +
            breakdown.recency
        )
    }

    /*
        * Calculate score breakdown
   */
    private calculateScoreBreakdown(offer:Offer, request:Request) {
        return {
            skillFit: this.calculateSkillFitScore(offer, request),
            availability: this.calculateAvailabilityScore(offer.availability, request.preferredTimeSlots),
            rating: this.calculateRatingScore(offer.user.rating),
            recency: this.calculateRecencyScore(offer.createdAt)
        }
    }

    /**
   * Skill fit score (0-40 points)
   */

    private calculateSkillFitScore(offer: Offer, request: Request): number{
        // Basic: skills match 
        if(offer.skillId === request.skillId) return 0;

        // Enhanced: check proficiency gap 
        const offerUserSkill = offer.user.skills.find(s => s.skillId === offer.skillId);

        if(!offerUserSkill) return 30; //default if no proficiency data

        const offerProficiency = offerUserSkill.proficiencyLevel; 
        const requestProficiency = 1

        const profieciencyGap = offerProficiency - requestProficiency;

        if(profieciencyGap >= 2) return 40; // excellent fit, Ideal Gap 
        if(profieciencyGap === 1) return 30; // Acceptable
        if(profieciencyGap === 0) return 20; // Peer-to-peer
    
        return 10; // poor fit, Teacher less experienced (not ideal)


        

    }

    /* 
    * Availability score (0-30 points)
    
    */

    private calculateAvailabilityScore(offerAvailability: string, requestTimeSlots: string): number {
        if(!offerAvailability || !requestTimeSlots) return 15; // default if no availability data (Neutral)

        const offerDays = this.extractDays(offerAvailability);
        const requestDays = this.extractDays(requestTimeSlots);

        if(offerDays.length === 0 || requestDays.length === 0) return 15; // Neutral if no valid days

        const overlap = offerDays.filter(day => requestDays.includes(day));
        const overlapPercentage = overlap.length / Math.max(offerDays.length, requestDays.length);

        return Math.round(overlapPercentage * 30); // Scale to 0-30 points
    }

   /**
   * Extract days from availability string
   */
    private extractDays(daySlots: string): string[] {
        const days = daySlots.split(',').map(slot => slot.trim().toLowerCase());
        const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        return days.filter(day => validDays.includes(day));
    }


    /* 
    * Rating score (0-20 points)
    */
   private calculateRatingScore(rating:number): number {
        // Rating is 0-5, normalize to 0-20 points
        return Math.round((rating / 5) * 20);
   }

    /*  
    * Recency score (0-10 points)
    */

    private calculateRecencyScore(createdAt: Date): number {
        const now = new Date()
        const hoursSinceCreated = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

        if(hoursSinceCreated <= 24) return 10; // created within last 24 hours
        if(hoursSinceCreated <= 72) return 7; // created within last 3 days
        if(hoursSinceCreated <= 168) return 3; // created within last week
        return 2; // Older than a week
    }

    /*
     * Calculate match expiry date ( 7 days from now)
    
    */
    private calculateExpiryDate(): Date {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        return expiryDate;
    }


    /* 
    * Get Match Suggestion for a user (based on their active requests and offers)
    */

    async getMatchSuggestionForUser(userId: string, query?: GetMatchesQueryDto): Promise<Match[]> {

        const {status, minScore, limit, offset} = query || {};

        const queryBuilder = this.matchRepository.createQueryBuilder('match').
        leftJoinAndSelect('match.offer', 'offer').
        leftJoinAndSelect('match.request', 'request').
        leftJoinAndSelect('offer.skill', 'offerSkill').
        leftJoinAndSelect('request.skill', 'requestSkill').
        leftJoinAndSelect('match.offeror', 'offeror').
        leftJoinAndSelect('match.requestor', 'requestor').
        where('(match.offerorId = :userId OR match.requestorId = :userId)', {userId}).
        orderBy('match.matchScore', 'DESC');

        if(status){
            queryBuilder.andWhere('match.status = :status', {status});
        }

        if(minScore !== undefined){
            queryBuilder.andWhere('match.matchScore >= :minScore', {minScore});
        }

        if(limit){
            queryBuilder.take(limit);
        }

        if(offset){
            queryBuilder.skip(offset);
        }

        return queryBuilder.getMany();
    }


    /* 
    * Get a sincle Match by ID (with offer and request details)
    */

    async getMatchById(matchId: string, userId: string): Promise<Match> {
        const match = await this.matchRepository.findOne({
            where: {id: matchId},
            relations: ['offer', 'request', 'offer.skill', 'request.skill', 'offeror', 'requestor']

        })
        if(!match){
            this.logger.warn(`Match ${matchId} not found`);
            throw new NotFoundException(`Match ${matchId} not found`);
        }

        // only offeror or requestor can view the match details
        if(match.offerorId !== userId && match.requestorId !== userId){
            this.logger.warn(`User ${userId} is not authorized to view match ${matchId}`);
            throw new ForbiddenException(`You are not authorized to view this match`);
        }
        return match;

    }


    /**
   * Accept a match (only requestor can accept)
   */

    async acceptMatch(matchId:string, userId: string, dto?: AcceptMatchDto): Promise<Match> {
        const match = await this.matchRepository.findOne({
            where: {id: matchId},
            relations: ['offer', 'request']
        })

        if(!match){
            throw new NotFoundException(`Match ${matchId} not found`);

        }

        if(match.requestorId !== userId && match.offerorId !== userId){
            throw new ForbiddenException(`You are not authorized to accept this match`);
        }

        if(match.status !== MatchStatus.PENDING){
            throw new BadRequestException(`Only pending matches can be accepted`);
        }

        match.status = MatchStatus.ACCEPTED;

        // You could store the optional message here if you want to keep a record of it (not implemented in the entity currently)
        // match.acceptMessage = dto?.message;

        const updated = await this.matchRepository.save(match);

        this.logger.log(`Match ${matchId} accepted by user ${userId}`);

        // TODO: Trigger notifications to the other user about acceptance
        // TODO: Optionally create a session record entity here automatically if you want to track active sessions between matched users
        return updated;
    }

    /**
     * Reject a match (only requestor can reject)
     */

    async rejectMatch(matchId: string, userId: string, dto?: RejectMatchDto): Promise<Match> {
        const match = await this.matchRepository.findOne({
            where: {id: matchId},

        })

        if(!match){
            throw new NotFoundException(`Match ${matchId} not found`);
        }

        if(match.requestorId !== userId && match.offerorId !== userId){
            throw new ForbiddenException(`You are not authorized to reject this match`);
        }

        if(match.status !== MatchStatus.PENDING){
            throw new BadRequestException(`Only pending matches can be rejected`);
        }
        match.status = MatchStatus.REJECTED;

        // you could store the optional reason here if you want to keep a record of it (not implemented in the entity currently)
        // match.rejectReason = dto?.reason;
        
        
        const updated = await this.matchRepository.save(match);
        this.logger.log(`Match ${matchId} rejected by user ${userId}`);
        return updated;

    }

     /**
   * Expire old matches (run daily) - This can also be done via a CRON job or a scheduled task
   */

    @Cron(CronExpression.EVERY_DAY_AT_3AM)
    async expireOldMatches():Promise<void> {
        const now = new Date()

        const expiredMatches = await this.matchRepository.find({
            where: {
                status: MatchStatus.PENDING,
                createdAt: LessThan(now)
            }
        })

        const toExpire = expiredMatches.filter(match => match.expiresAt && match.expiresAt < now);

        for (const match of toExpire){
            match.status = MatchStatus.EXPIRED;
            await this.matchRepository.save(match);
            this.logger.log(`Match ${match.id} has been expired`);
        }
    }

}
