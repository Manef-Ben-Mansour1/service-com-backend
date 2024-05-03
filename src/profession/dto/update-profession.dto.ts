import { IsNumber, IsOptional } from 'class-validator';


export class UpdateProfessionDto {

  @IsOptional()
  @IsNumber()
  readonly userId: number;

  @IsOptional()
  @IsNumber()
  readonly categoryId: number;


}