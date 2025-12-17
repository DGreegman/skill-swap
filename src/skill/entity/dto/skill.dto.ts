import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { SkillCategory } from "../skill.entity";

export class SkillDto {
    @ApiProperty({
        description: 'Skill name',
        example: 'Python',
        required: true
        })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Skill category',
        example: 'tech',
        required: true
        })
    @IsNotEmpty()
    @IsEnum(SkillCategory)
    category: SkillCategory;

    @ApiProperty({
        description: 'Skill description',
        example: 'High-level programming language for general-purpose programming Language!',
        required: false
        })
    @IsString()
    @IsOptional()
    description?: string;
}
    