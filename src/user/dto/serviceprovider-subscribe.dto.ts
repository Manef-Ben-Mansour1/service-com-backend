import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

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

    @IsOptional()
    profileImagePath: string;
    
    @IsNotEmpty()
    password: string; 

    @IsNotEmpty()
    document: string; 






}
