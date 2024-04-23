import { Controller, Post, Body, Get, UseGuards, Request, Req, Put, Delete, Param, Patch } from '@nestjs/common';
import { UserSubscribeDto } from './dto/user-subscribe.dto';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { LoginCredentialsDto } from './dto/LoginCredentials.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import AuthenticatedRequest from './interfaces/authReq.interface';
import { User } from 'c:/Users/21654/Desktop/nestjs apps/service-com-backend/src/decorators/user.decorator';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ) {

    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(@User() user): Promise<UserEntity[]> {
        return this.userService.findAll(user);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(
        @User() user,
        @Param('id') id: number): Promise<UserEntity> {
      return this.userService.findOne(user, id);
    }

    @Post()
    register(
        @Body() userData: UserSubscribeDto,
    ): Promise<Partial<UserEntity>> {
        return this.userService.register(userData);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @User() user,
        @Param('id') id: number, 
        @Body() userData: Partial<UserEntity>): Promise<UserEntity> {
      return this.userService.update(user, id, userData);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(
        @User() user,
        @Param('id') id: number): Promise<void> {
      return this.userService.remove(user, id);
    }

    @Post('login')
    login(@Body() credentials: LoginCredentialsDto) {
        return this.userService.login(credentials);
    }

}
