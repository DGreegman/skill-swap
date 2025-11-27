import { Match } from "@/match/entity/match.entity";
import { Message } from "@/message/entity/message.entity";
import { Offer } from "@/offer/entity/offer.entity";
import { Rating } from "@/rating/entity/rating.entity";
import { Request } from "@/request/entity/request.entity";
import { Session } from "@/session/enitity/session.entity";
import { Userskill } from "@/userskill/entity/userskill.entity";
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin'
}

@Entity('users')
@Index(['email'], { unique: true })
export class User{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER, nullable: true })
    role: UserRole;

    @Column({nullable: true})
    bio: string;

    @Column({ nullable: true })
    avatarUrl: string;  

    @Column({ nullable: true })
    location: string;


    @Column({ type: 'float', default: 0 })
    rating: number;

    @Column({ type: 'int', default: 0 })
    totalRatings: number;

    @Column({ nullable: true })
    refreshToken: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Relations
  @OneToMany(() => Userskill, (userSkill) => userSkill.user, {
    cascade: true,
    eager: false,
  })
  skills: Userskill[];

   
  @OneToMany(() => Offer, (offer) => offer.user, { cascade: true })
  offers: Offer[];
 
  @OneToMany(() => Request, (request) => request.user, { cascade: true })
  requests: Request[];

  @OneToMany(() => Match, (match) => match.offeror, { cascade: false })
  offerorMatches: Match[];

  @OneToMany(() => Match, (match) => match.requestor, { cascade: false })
  requestorMatches: Match[];

  @OneToMany(() => Session, (session) => session.teacher, { cascade: false })
  teacherSessions: Session[];

  @OneToMany(() => Session, (session) => session.learner, { cascade: false })
  learnerSessions: Session[];

  @OneToMany(() => Message, (message) => message.sender, { cascade: false })
  sentMessages: Message[];

  @OneToMany(() => Rating, (rating) => rating.rater, { cascade: false })
  ratingsGiven: Rating[];

  @OneToMany(() => Rating, (rating) => rating.ratee, { cascade: false })
  ratingsReceived: Rating[];
}   