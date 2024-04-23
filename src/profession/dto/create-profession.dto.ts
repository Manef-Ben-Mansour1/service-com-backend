import {  IsNumber } from 'class-validator';


export class CreateProfessionDto {


  @IsNumber()
  readonly userId: number;


  @IsNumber()
  readonly categoryId: number;


}