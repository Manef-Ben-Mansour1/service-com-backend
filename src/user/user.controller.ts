import { Controller, Post, Body, Get, UseGuards, Request, Req, Put, Delete, Param, Patch, UsePipes, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserSubscribeDto } from './dto/user-subscribe.dto';
import { ServiceProviderSubscribeDto} from  './dto/serviceprovider-subscribe.dto';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { LoginCredentialsDto } from './dto/LoginCredentials.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import AuthenticatedRequest from './interfaces/authReq.interface';
import { User } from 'src/decorators/user.decorator';
import { ValidationPipe } from '@nestjs/common';
import { UserRole } from 'src/decorators/userRole.decorator';
import { UserRoleEnum } from './enum/userRole.enum';
import { UserStatusEnum } from './enum/userStatus.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from './interfaces/multer-file.interface';

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

    @Post('register')
    @UsePipes(new ValidationPipe())
    async register(
        @Body() userData: UserSubscribeDto,
    ): Promise<Partial<UserEntity>> {
        return this.userService.register(userData);
    }

    @Post('s-provider-register')
    @UseInterceptors(FileInterceptor('file')) 
    async service_register(
        @Body() userData: ServiceProviderSubscribeDto,
        @UploadedFile() file: MulterFile, 
    ): Promise<Partial<UserEntity>> {
        return this.userService.service_register(userData, file);
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


    @Patch('approve/:id')
    @UseGuards(JwtAuthGuard)
    async approveServiceProvider(@User() user, @Param('id') id: number): Promise<Partial<UserEntity>> {
    return this.userService.approveServiceProvider(user, id);
    }


    @Patch('reject/:id')
    @UseGuards(JwtAuthGuard)
    async rejectServiceProvider(@User() user, @Param('id') id: number): Promise<Partial<UserEntity>> {
    return this.userService.rejectServiceProvider(user, id);
    }    

}
