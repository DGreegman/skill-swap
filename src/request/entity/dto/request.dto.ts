import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { UrgencyLevel } from "../request.entity";

export class RequestDto {
    @ApiProperty({
        example: 'I want to learn React.js',
        description: 'Description of the request',
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        example: 'Mon, Tue 7pm-9pm',
        description: 'Preferred time slots for the request',
    })
    @IsString()
    @IsNotEmpty()
    preferredTimeSlots: string;

    @ApiProperty({
        example: 'medium',
        description: 'Urgency level of the request',
    })
    @IsEnum(UrgencyLevel)
    @IsNotEmpty()
    urgencyLevel: UrgencyLevel;

    @ApiProperty({
        example: '618fb969-ba47-48df-bbad-40ba05c0ac47',
        description: 'Skill ID for the request',
    })
    @IsString()
    @IsNotEmpty()
    skillId: string;
}