import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException, InternalServerErrorException,
} from '@nestjs/common';
import { UserSubscribeDto } from './dto/user-subscribe.dto';
import { ServiceProviderSubscribeDto } from './dto/serviceprovider-subscribe.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginCredentialsDto } from './dto/LoginCredentials.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRoleEnum } from './enum/userRole.enum';
import { UserStatusEnum } from './enum/userStatus.enum';
import fs, { createWriteStream } from 'fs';
import { join } from 'path';
import { MulterFile } from './interfaces/multer-file.interface';
import { mkdirSync, existsSync } from 'fs';
import { error, profile } from 'console';
import * as mime from 'mime-types';
import { use } from 'passport';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, userData: Partial<UserEntity>): Promise<UserEntity> {
    await this.userRepository.update(id, userData);
    return await this.userRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async signup(user: Partial<UserEntity>, profileImage: MulterFile): Promise<void> {
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);

    if (profileImage) {
      const fileType = mime.lookup(profileImage.originalname);


      if (fileType && fileType.startsWith('image/')) {
        // Sanitize the original file name
        const sanitizedFileName = profileImage.originalname.replace(/[^a-z0-9.]/gi, '_');

        const uploadsDir = join(__dirname, '..', 'uploads', 'profile-images');
        // Ensure the uploads directory exists
        if (!existsSync(uploadsDir)) {
          mkdirSync(uploadsDir, { recursive: true });
        }
        const filePath = join(uploadsDir, Date.now() + sanitizedFileName);
        const fileStream = createWriteStream(filePath);

        fileStream.write(profileImage.buffer);
        fileStream.end();
        user.profileImagePath = filePath;
      } else {

        throw new BadRequestException('Veuillez télécharger une image');
      }

      const filePath1 = join(
        __dirname,
        '..',
        'uploads',
        'profile-images',
        Date.now() + profileImage.originalname,
      );
      const fileStream1 = createWriteStream(filePath1);
      fileStream1.write(profileImage.buffer);
      fileStream1.end();
      user.profileImagePath = filePath1;
    }

    try {
      await this.userRepository.save(user);
    } catch (e) {
      throw new ConflictException('Combinaison doit être unique');
    }
  }

  async register(
    userData: UserSubscribeDto,
    profileImage: MulterFile,
  ): Promise<Partial<UserEntity>> {
    const user = this.userRepository.create({ ...userData });
    await this.signup(user, profileImage);
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gouvernorat: user.gouvernorat,
      delegation: user.delegation,
      profileImagePath: user.profileImagePath,
    };
  }

  async service_register(
    userData: ServiceProviderSubscribeDto,
    profileImage: MulterFile,
  ): Promise<Partial<UserEntity>> {


    const user = this.userRepository.create({ ...userData });
    user.role = UserRoleEnum.SERVICE_PROVIDER;
    user.status = UserStatusEnum.PENDING;
    await this.signup(user, profileImage);


    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      profileImagePath: user.profileImagePath,

    }

  }

  async login(credentials: LoginCredentialsDto) {
    const { email, password } = credentials;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email=:email', { email })
      .getOne();

    if (!user) {
      throw new NotFoundException('email erroné');
    }

    const hashedPassword = await bcrypt.hash(password, user.salt);
    if (hashedPassword === user.password) {
      const payload = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gouvernorat: user.gouvernorat,
        delegation: user.delegation,
      };
      const jwt = await this.jwtService.sign(payload);
      return {
        access_token: jwt,
      };
    } else {
      throw new NotFoundException('password erroné');
    }
  }

  private isAdminOrOwner(user, id?: number): boolean {
    return user.role === UserRoleEnum.ADMIN || (id && user.id === Number(id));
  }

  async approveServiceProvider(id: number): Promise<Partial<UserEntity>> {
    const serviceProvider = await this.userRepository.findOne({
      where: { id },
    });

    if (
      !serviceProvider ||
      serviceProvider.role !== UserRoleEnum.SERVICE_PROVIDER ||
      serviceProvider.status !== UserStatusEnum.PENDING
    ) {
      throw new NotFoundException(
        'Service provider non trouvé ou compte non pending.',
      );
    }

    serviceProvider.status = UserStatusEnum.APPROVED;
    await this.userRepository.save(serviceProvider);

    return {
      id: serviceProvider.id,
      firstName: serviceProvider.firstName,
      status: serviceProvider.status,
    };
  }

  async rejectServiceProvider(id: number): Promise<Partial<UserEntity>> {
    const serviceProvider = await this.userRepository.findOne({
      where: { id },
    });


    if (
      !serviceProvider ||
      serviceProvider.role !== UserRoleEnum.SERVICE_PROVIDER ||
      serviceProvider.status !== UserStatusEnum.PENDING
    ) {
      throw new NotFoundException(
        'service provider non trouvé ou compte non pending.',
      );

    }

    serviceProvider.status = UserStatusEnum.REJECTED;
    await this.userRepository.save(serviceProvider);
    return {
      id: serviceProvider.id,
      firstName: serviceProvider.firstName,
      status: serviceProvider.status,
    };
  }

  private isAdmin(user): boolean {
    return user.role === UserRoleEnum.ADMIN;
  }

  async uploadCv(id: number, cv: MulterFile): Promise<Partial<UserEntity>> {
    const userToUpdate = await this.userRepository.findOne({
      where: { id },
    });

    if (!userToUpdate) {
      throw new NotFoundException('Utilisateur non trouvé.');
    }

    if (!cv) {
      throw new BadRequestException('Veuillez télécharger un cv.');
    }
    const fileType = mime.lookup(cv.originalname);

    if (fileType && fileType.startsWith('application/pdf')) {
     const oldCv = userToUpdate.document;

      // Sanitize the original file name
      const sanitizedFileName = cv.originalname.replace(/[^a-z0-9.]/gi, '_');

      const uploadsDir = join(__dirname, '..', 'uploads', 'cvs');
      // Ensure the uploads directory exists
      if (!existsSync(uploadsDir)) {
        mkdirSync(uploadsDir, { recursive: true });
      }
      const filePath = join(uploadsDir, Date.now() + sanitizedFileName);
      const fileStream = createWriteStream(filePath);

      fileStream.write(cv.buffer);
      fileStream.end();
      userToUpdate.document = filePath;
      const newUser= await this.userRepository.save(userToUpdate);
      if(oldCv){
          const fs = require('fs');
          fs.unlink(oldCv, (err) => {
            if (err) {


            }


          });


      }
      return newUser;


    }else {
      throw new BadRequestException('Veuillez télécharger un cv en pdf.');
    }


  }

}
