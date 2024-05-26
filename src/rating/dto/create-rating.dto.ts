import { Min, Max,  } from 'class-validator';
import { IsNotEmpty,IsNumber } from "class-validator";
import {Type} from 'class-transformer'



export class CreateRatingDto {
  
  @Type(()=>Number)
  @IsNumber()
  @Min(0) 
  @Max(5) 
  value: number;

  @IsNotEmpty()
  serviceId:number;
}
