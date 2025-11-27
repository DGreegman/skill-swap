import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { User } from '@/users/entity/user.entity';
import { Session } from '@/session/enitity/session.entity';

@Entity('ratings')
@Unique(['sessionId', 'raterId'])
@Index(['raterId'])
@Index(['rateeId'])
@Index(['createdAt'])
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 5 })
  score: number; // 1-5 stars

  @Column({ nullable: true })
  feedback: string;

  @CreateDateColumn()
  createdAt: Date;

  // Foreign Keys
  @Column()
  raterId: string; // User giving the rating

  @Column()
  rateeId: string; // User receiving the rating

  @Column({ nullable: true })
  sessionId: string; // Optional: link to specific session

  // Relations
  @ManyToOne(() => User, (user) => user.ratingsGiven, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'raterId' })
  rater: User;

  @ManyToOne(() => User, (user) => user.ratingsReceived, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'rateeId' })
  ratee: User;

  @ManyToOne(() => Session, { onDelete: 'SET NULL', eager: false })
  @JoinColumn({ name: 'sessionId' })
  session: Session;
}
