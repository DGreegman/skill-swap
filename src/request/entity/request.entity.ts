import { Match } from "@/match/entity/match.entity";
import { Skill } from "@/skill/entity/skill.entity";
import { User } from "@/users/entity/user.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UrgencyLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Entity('requests')
@Index(['userId'])
@Index(['skillId'])
@Index(['urgencyLevel'])
@Index(['createdAt'])
export class Request {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  preferredTimeSlots: string; // e.g., "Mon, Tue 7pm-9pm"

  @Column({ type: 'enum', enum: UrgencyLevel, default: UrgencyLevel.MEDIUM })
  urgencyLevel: UrgencyLevel;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  matchCount: number; // Denormalized for quick filtering

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Foreign Keys
  @Column()
  userId: string;

  @Column()
  skillId: string;

  // Relations
  @ManyToOne(() => User, (user) => user.requests, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Skill, (skill) => skill.requests, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'skillId' })
  skill: Skill;

  @OneToMany(() => Match, (match) => match.request, { cascade: true })
  matches: Match[];
}