import { Offer } from "@/offer/entity/offer.entity";
import { Request } from "@/request/entity/request.entity";
import { Userskill } from "@/userskill/entity/userskill.entity";
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum SkillCategory {
    TECH = 'tech',
    DESIGN = 'design',
    BUSINESS = 'business',
    LANGUAGES = 'languages',
    MUSIC = 'music',
    SPORTS = 'sports',
    COOKING = 'cooking',
    OTHER = 'other',
}

@Entity('skills')
@Index(['name', 'category'])
export class Skill {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'enum', enum: SkillCategory })
    category: SkillCategory;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    // Relations
    @OneToMany(() => Userskill, (userSkill) => userSkill.skill, { cascade: true })
    userSkills: Userskill[];

    @OneToMany(() => Offer, (offer) => offer.skill, { cascade: false })
    offers: Offer[];

    @OneToMany(() => Request, (request) => request.skill, { cascade: false })
    requests: Request[];
}   
