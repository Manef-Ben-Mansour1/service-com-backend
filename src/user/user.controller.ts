import { Controller, Post, Body, Get, UseGuards, Request, Req, Put, Delete, Param } from '@nestjs/common';
import { UserSubscribeDto } from './dto/user-subscribe.dto';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { LoginCredentialsDto } from './dto/LoginCredentials.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import AuthenticatedRequest from './interfaces/authReq.interface';
import { User } from 'src/decorators/user.decorator';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ) {

    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(
        @Request() request
    ): Promise<UserEntity[]> {
        console.log(request.user);
        return this.userService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<UserEntity> {
      return this.userService.findOne(id);
    }

    @Post()
    register(
        @Body() userData: UserSubscribeDto,
    ): Promise<Partial<UserEntity>> {
        return this.userService.register(userData);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() userData: Partial<UserEntity>): Promise<UserEntity> {
      return this.userService.update(+id, userData);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
      return this.userService.remove(+id);
    }

    @Post('login')
    login(@Body() credentials: LoginCredentialsDto) {
        return this.userService.login(credentials);
    }



}
