import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Skill } from "../../skill/entity/skill.entity";
import { User } from "../../users/entity/user.entity";

export enum ProficiencyLevel {
    BEGINNER = 1,
    INTERMEDIATE = 2,
    ADVANCED = 3,
    EXPERT = 4,
    MASTER = 5,
}

@Entity('user_skills')
@Unique(['userId', 'skillId'])
@Index(['userId'])
@Index(['skillId'])
export class Userskill {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: ProficiencyLevel })
    proficiencyLevel: ProficiencyLevel;

    @Column({ nullable: true })
    yearsOfExperience: number;

    @CreateDateColumn()
    createdAt: Date;

    // Foreign Keys
    @Column()
    userId: string;

    @Column()
    skillId: string;

    // Relations
    @ManyToOne(() => User, (user) => user.skills, {
        onDelete: 'CASCADE',
        eager: false,
    })
    @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Skill, (skill) => skill.userSkills, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'skillId' })
  skill: Skill;

    /* // Relations
    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Skill, { nullable: false })
    @JoinColumn({ name: 'skillId' })
    skill: Skill; */
}