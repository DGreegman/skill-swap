import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponse } from './interface/user-response.interface';
import { LoginDTO } from './dto/login.dto'
import { Public } from './decorators/auth.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createUserController(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    const user = await this.usersService.createUserService(createUserDto);
    return this.usersService.generateUserResponse(user, 'User successfully Registered');
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async loginUserController(@Body() loginDto: LoginDTO): Promise<UserResponse> {
    const user = await this.usersService.LoginUser(loginDto.email, loginDto.password);
    return this.usersService.generateUserResponse(user, 'User successfully logged in', 'token');
  }

  @ApiBearerAuth()
  @Get('all')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  async getAllUsersController(): Promise<UserResponse[]> {
    const users = await this.usersService.getAllUsers();
    return Promise.all(users.map(user => this.usersService.generateUserResponse(user)));
  }
}
