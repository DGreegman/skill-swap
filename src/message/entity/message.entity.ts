import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Session } from '@/session/enitity/session.entity';
import { User } from '@/users/entity/user.entity';

@Entity('messages')
@Index(['sessionId'])
@Index(['senderId'])
@Index(['createdAt'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // Foreign Keys
  @Column()
  sessionId: string;

  @Column()
  senderId: string;

  // Relations
  @ManyToOne(() => Session, (session) => session.messages, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'sessionId' })
  session: Session;

  @ManyToOne(() => User, (user) => user.sentMessages, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'senderId' })
  sender: User;
}