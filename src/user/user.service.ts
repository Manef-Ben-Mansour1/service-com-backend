import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
  async findAll(): Promise<UserEntity[]> {
    
    return await this.userRepository.find();
 
}
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { firstName, lastName, gouvernorat, delegation, email, password } = createUserDto;

    // Hash password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user entity
    const newUser = new UserEntity();
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.gouvernorat = gouvernorat;
    newUser.delegation = delegation;
    newUser.email = email;
    newUser.password = hashedPassword;
    newUser.salt = salt;
    newUser.profileImagePath="aa";

    // Save user to database
    return this.userRepository.save(newUser);
  }

}