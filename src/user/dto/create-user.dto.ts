import { IsString, IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRoleEnum } from '../enum/userRole.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  gouvernorat: string;

  @IsNotEmpty()
  @IsString()
  delegation: string;

 
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

}