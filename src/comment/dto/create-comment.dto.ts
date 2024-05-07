import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty()
    @MaxLength(255, { message: "Content length must not exceed 255 characters" })
    content: string;
}
