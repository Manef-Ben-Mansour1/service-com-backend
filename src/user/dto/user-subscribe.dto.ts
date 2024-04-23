import { IsEmail, IsNotEmpty, IsEnum} from "class-validator";
import { UserRoleEnum } from "../enum/userRole.enum";

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

    @IsNotEmpty()
    password: string; 

    @IsEnum(UserRoleEnum)
    role: UserRoleEnum;
}