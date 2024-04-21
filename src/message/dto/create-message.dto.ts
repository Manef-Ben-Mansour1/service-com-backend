import { IsString , IsNotEmpty, IsNumber } from "class-validator";
import { Type } from "class-transformer";


export class CreateMessageDto {
    @IsNotEmpty()
    @IsString()
    text: string;

    @IsNotEmpty()
    @Type(() => Number )
    @IsNumber()
    senderId: number;

    @IsNotEmpty()
    @Type(() => Number )
    @IsNumber()
    recipientId: number;



}
