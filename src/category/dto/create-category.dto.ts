import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';


export class CreateCategoryDto {

  @IsOptional()
  @IsNumber()
  readonly parentId: number;

  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsUrl()
  readonly iconPath: string;
}