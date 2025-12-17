import { IsEnum, IsNumber, IsString } from "class-validator";
import { ProficiencyLevel } from "../entity/userskill.entity";
import { ApiProperty } from "@nestjs/swagger";

export class UserSkillDto {
    @IsNumber()
    @IsEnum(ProficiencyLevel)
    @ApiProperty({
        description: 'Proficiency level',
        example: 1,
        required: true
    })
    proficiencyLevel: ProficiencyLevel;

    @IsNumber()
    @ApiProperty({
        description: 'Years of experience',
        example: 5,
        required: true
    })
    yearsOfExperience: number;
   
    @IsString()
    @ApiProperty({
        description: 'Skill ID',
        example: 'Skill ID',
        required: true
    })
    skillId: string;
}