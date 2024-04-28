import { UserRoleEnum } from "../enum/userRole.enum";
import { IsEmail, IsNotEmpty, IsEnum, IsOptional, isNotEmpty } from "class-validator";

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
    profileImagePath: string

    @IsNotEmpty()
    password: string; 

    @IsEnum(UserRoleEnum)
    role: UserRoleEnum;

}