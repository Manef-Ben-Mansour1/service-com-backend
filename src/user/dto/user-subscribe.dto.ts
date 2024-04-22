import { IsEmail, IsNotEmpty, isNotEmpty } from "class-validator";

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
}