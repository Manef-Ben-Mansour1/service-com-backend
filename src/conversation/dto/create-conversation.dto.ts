import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateConversationDto  {
 
    @IsNotEmpty()
    @Type(() => Number )
    @IsNumber()
    user1Id: number;

    @IsNotEmpty()
    @Type(() => Number )
    @IsNumber()
    user2Id: number;

}
