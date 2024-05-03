import { IsNotEmpty, IsNumber, IsString } from 'class-validator';


export class CreateServiceDto {

  @IsString()
  readonly title: string;


  @IsString()
  readonly description: string;

  @IsString()
  readonly imagePath: string;

  @IsNumber()
  readonly basePrice: number;

  @IsNumber()
  readonly professionId: number;
}