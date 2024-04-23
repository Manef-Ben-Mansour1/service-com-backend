import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';


export class CreateOrderDto {

  @IsNotEmpty()
  @IsNumber()
  readonly serviceId: number;

  @IsNotEmpty()
  @IsString()
  readonly date: Date;

}