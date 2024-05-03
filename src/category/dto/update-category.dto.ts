import {  IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';


export class UpdateCategoryDto {

  @IsOptional()
  @IsNumber()
  readonly parentId: number;

  @IsOptional()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsUrl()
  readonly iconPath: string;
}