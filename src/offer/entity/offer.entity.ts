import { Match } from "@/match/entity/match.entity";
import { Skill } from "@/skill/entity/skill.entity";
import { User } from "@/users/entity/user.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('offers')
@Index(['userId'])
@Index(['skillId'])
@Index(['isActive'])
@Index(['createdAt'])
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  availability: string; // e.g., "Mon, Wed, Fri 6pm-8pm"

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
  @ManyToOne(() => User, (user) => user.offers, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Skill, (skill) => skill.offers, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'skillId' })
  skill: Skill;

  @OneToMany(() => Match, (match) => match.offer, { cascade: true })
  matches: Match[];

   
}