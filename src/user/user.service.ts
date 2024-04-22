import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserSubscribeDto} from  './dto/user-subscribe.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginCredentialsDto} from  './dto/LoginCredentials.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository:  Repository<UserEntity>,
        private jwtService: JwtService
    )   {
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


    async register(userData: UserSubscribeDto) : Promise<Partial<UserEntity>> {
        const user = this.userRepository.create({...userData})

        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, user.salt);
        try{
            await this.userRepository.save(user);

        } catch (e) {
            throw new ConflictException('Combinaison doit être unique');
        }

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            gouvernorat: user.gouvernorat,
            delegation: user.delegation            
        }; 
    }

    async login(credentials: LoginCredentialsDto) {
        const { email, password } = credentials;

        const user = await this.userRepository.createQueryBuilder("user")
            .where("user.email=:email",
                {email}
            )
            .getOne();
        
            if (!user) {
                throw new NotFoundException("email erroné");
            }
        
        const hashedPassword= await bcrypt.hash(password, user.salt);
        if (hashedPassword===user.password) {
            const payload = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                gouvernorat: user.gouvernorat,
                delegation: user.delegation            
            }
            const jwt= await this.jwtService.sign(payload);
            return {
                "access_token": jwt
            };
        }

        else {
            throw new NotFoundException("password erroné");
        }
    }

}
