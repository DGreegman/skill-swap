import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../entity/user.entity";

export class CreateUserDto {
    @ApiProperty({
        description: 'User full name',
        example: 'John Doe'
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'User email address',
        example: 'john.doe@example.com'
    })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'SecurePassword123!'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6, {message: 'Password must be at least 6 characters long'})
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'})
    password: string;
    @ApiProperty({
        description: 'User bio/description',
        example: 'I love learning new skills!',
        required: false
    })
    @IsString()
    @IsOptional()
    bio?: string;

    @ApiProperty({
        description: 'User location',
        example: 'New York, USA',
        required: false
    })
    @IsString()
    @IsOptional()
    location?: string;

    @ApiProperty({
        description: 'URL to user avatar image',
        example: 'https://example.com/avatar.jpg',
        required: false
    })
    @IsString()
    @IsOptional()
    avatarUrl?: string;

    @ApiProperty({
        description: 'User role',
        enum: UserRole,
        example: UserRole.USER,
        required: false
    })
    @IsEnum(UserRole)
    role?: UserRole;
}   