import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
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
import  { createWriteStream } from 'fs';
import { join } from 'path';
import { MulterFile } from './interfaces/multer-file.interface';
import { mkdirSync, existsSync } from 'fs';
import * as mime from 'mime-types';
import { use } from 'passport';
import { Response } from 'express';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    } else {
      return user;
    }
  }
  async update(id: number, userData: Partial<UserEntity>): Promise<UserEntity> {  
    const user =  await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    } else {
      const updatedUser = await this.userRepository.update(id, userData);
      return  updatedUser.raw[0];
    }
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async signup(
    user: Partial<UserEntity>,
    profileImage: MulterFile,
  ): Promise<void> {
    const email = user.email;
    const userWithEmail = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email=:email', { email })
      .getOne();

    if (userWithEmail) {
      throw new NotFoundException('Email already exists.');
    }
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);

    if (profileImage) {
      const fileType = mime.lookup(profileImage.originalname);

      if (fileType && fileType.startsWith('image/')) {
        // Sanitize the original file name
        const sanitizedFileName = profileImage.originalname.replace(
          /[^a-z0-9.]/gi,
          '_',
        );

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
    };
  }

  async login(credentials: LoginCredentialsDto, res: Response) {
    const { email, password } = credentials;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email=:email', { email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Wrong Credentials');
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
      const nbHours = 3;
      const expirationTime = nbHours * 3600; // 1 hour in seconds
      const jwt = this.jwtService.sign(payload, { expiresIn: expirationTime });
      // Set the JWT in an HTTP-only cookie
      const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + expirationTime * 1000),
        path: '/',
        // You can set other cookie options here, such as `secure: true` for HTTPS
      };

      res.cookie('jwtToken', jwt, cookieOptions);

      // You can now send a response indicating success
      return res.send({ message: 'Login successful' });
    } else {
      throw new UnauthorizedException('Wrong credentials');
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

    if (userToUpdate.role != UserRoleEnum.SERVICE_PROVIDER) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à effectuer cette action.Il faut etre prestataire de service",
      );
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
      const newUser = await this.userRepository.save(userToUpdate);
      if (oldCv) {
        const fs = require('fs');
        fs.unlink(oldCv, (err) => {
          if (err) {
          }
        });
      }
      return newUser;
    } else {
      throw new BadRequestException('Veuillez télécharger un cv en pdf.');
    }
  }
}

