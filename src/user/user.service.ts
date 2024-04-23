import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserSubscribeDto} from  './dto/user-subscribe.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginCredentialsDto} from  './dto/LoginCredentials.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRoleEnum } from './enum/userRole.enum';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository:  Repository<UserEntity>,
        private jwtService: JwtService
    )   {
    }

    async findAll(user): Promise<UserEntity[]> {
        if (this.isAdminOrOwner(user)) {
            return await this.userRepository.find();
        } else {
            throw new UnauthorizedException("Vous n'êtes pas autorisé à voir tous les utilisateurs.");
        }
    }
    
    async findOne(user, id: number): Promise<UserEntity> {
        if (this.isAdminOrOwner(user, id))
            return await this.userRepository.findOne({ where: { id } });

        throw new UnauthorizedException("Vous n'êtes pas autorisé à voir cet utilisateur.");
    }
    
 
    async update(user, id: number, userData: Partial<UserEntity>): Promise<UserEntity> {
        if (this.isAdminOrOwner(user, id)) {
            await this.userRepository.update(id, userData);
            return await this.userRepository.findOne({ where: {id} });
        } else {
            throw new UnauthorizedException("Vous n'êtes pas autorisé à mettre à jour cet utilisateur.");
        }
    }
    
    async remove(user, id: number): Promise<void> {
        if (this.isAdminOrOwner(user, id)) {
            await this.userRepository.delete(id);
        } else {
            throw new UnauthorizedException("Vous n'êtes pas autorisé à supprimer cet utilisateur.");
        }
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
            delegation: user.delegation,
            role: user.role          
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

    private isAdminOrOwner(user, id?: number): boolean {
        return (user.role === UserRoleEnum.ADMIN) || (id && user.id === Number(id));
    }
}
