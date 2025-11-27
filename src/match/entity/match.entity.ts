import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Offer } from '@/offer/entity/offer.entity';
import { Request } from '@/request/entity/request.entity';
import { User } from '@/users/entity/user.entity';
import { Session } from '@/session/enitity/session.entity';
// import { Session } from '@/session/entity/session.entity';

export enum MatchStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  COMPLETED = 'completed',
}

@Entity('matches')
@Index(['offerId'])
@Index(['requestId'])
@Index(['status'])
@Index(['createdAt'])
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', default: 0 })
  matchScore: number; // Calculated match score (0-100)

  @Column({ type: 'enum', enum: MatchStatus, default: MatchStatus.PENDING })
  status: MatchStatus;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Foreign Keys
  @Column()
  offerId: string;

  @Column()
  requestId: string;

  @Column()
  offerorId: string; // User who made the offer

  @Column()
  requestorId: string; // User who made the request

  // Relations
  @ManyToOne(() => Offer, (offer) => offer.matches, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'offerId' })
  offer: Offer;

  @ManyToOne(() => Request, (request) => request.matches, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'requestId' })
  request: Request;

  @ManyToOne(() => User, (user) => user.offerorMatches, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'offerorId' })
  offeror: User;

  @ManyToOne(() => User, (user) => user.requestorMatches, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'requestorId' })
  requestor: User;

  @OneToMany(() => Session, (session) => session.match, { cascade: true })
  sessions: Session[];
}
