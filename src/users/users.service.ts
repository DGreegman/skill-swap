import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role, User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponse } from './interface/user-response.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { isUUID } from 'class-validator';
import { DeleteResult } from 'typeorm';
@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>, private jwtService: JwtService) { }

    async createUserService(createUserDTO: CreateUserDto): Promise<User> {
        if(createUserDTO.email === 'admin@admin.com') {
            createUserDTO.role = Role.ADMIN;
        }
        console.log(createUserDTO.role)
        createUserDTO.role = Role.USER;
        const user = this.userRepository.create({
            ...createUserDTO,
            role: createUserDTO.role,
            password: await this.hashPassword(createUserDTO.password)
        });
        try {
            return await this.userRepository.save(user);
        } catch (error) {
            if (error.code === '23505' || error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('User already exists');
            }
            throw error;
        }
    }

    private async findUserByEmail(email: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            return null;
        }
        return user;
    }

    async LoginUser(email: string, password: string): Promise<User> {
        const user = await this.findUserByEmail(email);
        if (!user) {
            throw new BadRequestException('Invalid Email or Password');
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new BadRequestException('Invalid Email or Password');
        }
        return user;
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }
    private async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    generateToken(user: User): string {
        const payload = { id: user.id, email: user.email }
        return this.jwtService.sign(payload);
    }

    async generateUserResponse(user: User, message?: string, token?: string): Promise<UserResponse> {
        return {
            message,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                password: user.password,
                token: token ? this.generateToken(user) : ''
            }
        }
    }

    async deleteUserById(id: string): Promise<DeleteResult> {
        if (!isUUID(id)) {
            throw new BadRequestException('Invalid User ID');
        }
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new BadRequestException('User not found');
        }
        return await this.userRepository.delete(id);
    }

}
