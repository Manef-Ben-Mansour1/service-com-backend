import { IsNotEmpty, MaxLength, isNotEmpty, IsString } from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255, { message: "Content length must not exceed 255 characters" })
    content: string;

    @IsNotEmpty()
    serviceId:number;

    
}
