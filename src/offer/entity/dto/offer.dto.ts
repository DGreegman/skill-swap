import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class OfferDTO {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true, example: 'Description of the offer' })
    description: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ 
        description: 'Availability of the offer, e.g. "Every day, Mon, Tue, etc..." or "Only on weekends"',
        example: 'Every day, Mon, Tue, etc... or Only on weekends' 
    })
    availability: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({  
        description: 'Skill ID of the offer',
    })
    skillId: string;
}

export class UpdateOfferDTO {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, example: 'Description of the offer' })
    description?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ 
        description: 'Availability of the offer, e.g. "Every day, Mon, Tue, etc..." or "Only on weekends"',
        example: 'Every day, Mon, Tue, etc... or Only on weekends' 
    })
    availability?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ 
        description: 'User ID of the offer',
    })
    userId?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({  
        description: 'Skill ID of the offer',
    })
    skillId?: string;
}