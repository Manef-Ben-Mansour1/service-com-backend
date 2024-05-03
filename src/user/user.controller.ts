import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Req,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import { UserSubscribeDto } from './dto/user-subscribe.dto';
import { ServiceProviderSubscribeDto } from './dto/serviceprovider-subscribe.dto';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { LoginCredentialsDto } from './dto/LoginCredentials.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import AuthenticatedRequest from './interfaces/authReq.interface';
import { User } from '../decorators/user.decorator';
import { UserRoleEnum } from './enum/userRole.enum';
import { UserStatusEnum } from './enum/userStatus.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from './interfaces/multer-file.interface';
import { profile } from 'console';
import { response } from 'express';
import { AdminOrSelfGuard } from './guards/admin-or-self.guard';
import { AdminGuard } from './guards/admin.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number): Promise<UserEntity> {
    return this.userService.findOne(+id);
  }


  @Post('register')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('profileImage'))
  async register(
    @Body() userData: UserSubscribeDto,
    @UploadedFile() profileImage: MulterFile,
    @Req() request: Request,
  ): Promise<Partial<UserEntity>> {
    console.log(response.status);
    return this.userService.register(userData, profileImage);
  }


  @Post('s-provider-register')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('profileImage'))
  async service_register(
    @Body() userData: ServiceProviderSubscribeDto,
    @UploadedFile() profileImage: MulterFile,
  ): Promise<Partial<UserEntity>> {
    return this.userService.service_register(userData, profileImage);
  }


  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminOrSelfGuard)
  async update(
    @Param('id') id: number,
    @Body() userData: Partial<UserEntity>,
  ): Promise<UserEntity> {
    return this.userService.update(+id, userData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminOrSelfGuard)
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(+id);
  }

  @Post('login')
  login(@Body() credentials: LoginCredentialsDto) {
    return this.userService.login(credentials);
  }

    @Patch("cv")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('cv'))
    async uploadCv(
      @User() user,
      @UploadedFile() cv: MulterFile
    ): Promise<Partial<UserEntity>> {
        return this.userService.uploadCv(user.id, cv);
    }




  @Patch('approve/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async approveServiceProvider(
    @Param('id') id: number,
  ): Promise<Partial<UserEntity>> {
    return this.userService.approveServiceProvider(+id);
  }

  @Patch('reject/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async rejectServiceProvider(
    @Param('id') id: number,
  ): Promise<Partial<UserEntity>> {
    return this.userService.rejectServiceProvider(+id);
  }
}
