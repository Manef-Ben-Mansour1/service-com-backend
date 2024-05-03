import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
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
import { createWriteStream } from 'fs';
import { join } from 'path';
import { MulterFile } from './interfaces/multer-file.interface';
import { error, profile } from 'console';
import * as mime from 'mime-types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async findAll(user): Promise<UserEntity[]> {
    if (this.isAdminOrOwner(user)) {
      return await this.userRepository.find();
    } else {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à voir tous les utilisateurs.",
      );
    }
  }

  async findOne(user, id: number): Promise<UserEntity> {
    if (this.isAdminOrOwner(user, id))
      return await this.userRepository.findOne({ where: { id } });

    throw new UnauthorizedException(
      "Vous n'êtes pas autorisé à voir cet utilisateur.",
    );
  }

  async update(
    user,
    id: number,
    userData: Partial<UserEntity>,
  ): Promise<UserEntity> {
    if (this.isAdminOrOwner(user, id)) {
      await this.userRepository.update(id, userData);
      return await this.userRepository.findOne({ where: { id } });
    } else {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à mettre à jour cet utilisateur.",
      );
    }
  }

  async remove(user, id: number): Promise<void> {
    if (this.isAdminOrOwner(user, id)) {
      await this.userRepository.delete(id);
    } else {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à supprimer cet utilisateur.",
      );
    }
  }

  async signup(
    user: Partial<UserEntity>,
    profileImage: MulterFile,
  ): Promise<void> {
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);
    if (profileImage) {
      const fileType = mime.lookup(profileImage.originalname);
      if (fileType && fileType.startsWith('image/')) {
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
      } else {
        throw new BadRequestException('Veuillez télécharger une image');
      }
    }
    try {
      await this.userRepository.save(user);
    } catch (e) {
      console.log(e);
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
    };
  }

  async service_register(
    userData: ServiceProviderSubscribeDto,
    profileImage: MulterFile,
  ): Promise<Partial<UserEntity>> {
    const user = this.userRepository.create({ ...userData });

    try {
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
    } catch (error) {
      console.log(error);
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

  async approveServiceProvider(user, id: number): Promise<Partial<UserEntity>> {
    if (!this.isAdmin(user)) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à approuver un service provider.",
      );
    }

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

  async rejectServiceProvider(user, id: number): Promise<Partial<UserEntity>> {
    if (!this.isAdmin(user)) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à rejeter un service provider.",
      );
    }

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
}
