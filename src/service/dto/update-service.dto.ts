import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';


export class UpdateServiceDto {

  @IsOptional()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly description: string;
  @IsOptional()
  @IsString()
  readonly imagePath: string;

  @IsOptional()
  @IsNumber()
  readonly basePrice: number;

  @IsOptional()
  @IsNumber()
  readonly professionId: number;
}