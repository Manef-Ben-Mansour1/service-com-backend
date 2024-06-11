import { IsEnum } from 'class-validator';
import { UserRoleEnum } from '../enum/userRole.enum';
import { IsEmail, IsNotEmpty, IsOptional, isNotEmpty } from 'class-validator';

export class UserSubscribeDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  gouvernorat: string;

  @IsNotEmpty()
  delegation: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  profileImagePath: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  role: UserRoleEnum;
}
