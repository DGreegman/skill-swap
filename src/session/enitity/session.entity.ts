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
import { Match } from '@/match/entity/match.entity';
import { User } from '@/users/entity/user.entity';
import { Message } from '@/message/entity/message.entity';
// import { Message } from '@/message/entity/message.entity';

export enum SessionStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

@Entity('sessions')
@Index(['matchId'])
@Index(['teacherId'])
@Index(['learnerId'])
@Index(['status'])
@Index(['scheduledAt'])
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  scheduledAt: Date;

  @Column({ type: 'int', default: 60 }) // duration in minutes
  duration: number;

  @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.SCHEDULED })
  status: SessionStatus;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  meetingLink: string; // Zoom, Google Meet, etc.

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Foreign Keys
  @Column()
  matchId: string;

  @Column()
  teacherId: string; // The user who is teaching (offeror)

  @Column()
  learnerId: string; // The user who is learning (requestor)

  // Relations
  @ManyToOne(() => Match, (match) => match.sessions, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'matchId' })
  match: Match;

  @ManyToOne(() => User, (user) => user.teacherSessions, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'teacherId' })
  teacher: User;

  @ManyToOne(() => User, (user) => user.learnerSessions, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'learnerId' })
  learner: User;

  @OneToMany(() => Message, (message) => message.session, { cascade: true })
  messages: Message[];
}