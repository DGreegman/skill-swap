import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDTO {
    @ApiProperty({
        description: 'User email address',
        example: 'john.doe@example.com'
    })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'password123'
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}