import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponse } from './interface/user-response.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>, private jwtService:JwtService) {}

    async createUserService(createUserDTO:CreateUserDto):Promise<User>{
        const user = this.userRepository.create(createUserDTO);
        const existingUser = await this.findUserByEmail(createUserDTO.email);
        if(existingUser){
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
        user.password = await this.hashPassword(createUserDTO.password);
        return await this.userRepository.save(user);
    }

   private async  findUserByEmail(email:string):Promise<User | null>{
        const user = await this.userRepository.findOne({where:{email}});
        if(!user){
            return null;
        }
        return user;
    }

    async LoginUser(email:string, password:string):Promise<User>{
        const user = await this.findUserByEmail(email);
        if(!user){
            throw new BadRequestException('Invalid Email or Password');
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            throw new BadRequestException('Invalid Email or Password');
        }
        return user;
    }
    
    async getAllUsers():Promise<User[]>{
        return await this.userRepository.find();
    }
    private async hashPassword(password:string):Promise<string>{
        return await bcrypt.hash(password, 10);
    }

     generateToken(user:User):string{
        const payload = {id: user.id, email: user.email}
        return  this.jwtService.sign(payload);
    }
    async generateUserResponse(user:User, message?:string, token?:string ): Promise<UserResponse>{
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
    
}
