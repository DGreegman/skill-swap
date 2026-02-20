import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config";
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/role.guards';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      useClass: RolesGuard,
      provide: APP_GUARD
    }
  ],
  imports: [
    TypeOrmModule.forFeature([User]),
    
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ]
})
export class UsersModule { }
