import { IsEmail, IsNotEmpty } from "class-validator";

export class ServiceProviderSubscribeDto {

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

    @IsNotEmpty()
    profileImagePath: string;
}
