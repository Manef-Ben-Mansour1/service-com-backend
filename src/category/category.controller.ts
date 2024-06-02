// category.controller.ts
import { Controller, Post, Body, Patch, Param, ParseIntPipe, Delete, Get, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryEntity } from './entities/category.entity';
import {UpdateCategoryDto} from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  
  @Get()
  async getAllCategories(): Promise<any> {
    return this.categoryService.getCategoriesWithServiceCounts();
  }


  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Patch(':id')
  async update(@Param('id',ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  async  delete(@Param('id',ParseIntPipe) id: number): Promise<CategoryEntity> {
    return this.categoryService.deleteCategory(id);
  }

  @Patch('recover/:id')
  async  recover(@Param('id',ParseIntPipe) id: number): Promise<CategoryEntity> {
    return this.categoryService.recoverCategory(id);
  }


  @Get(':id')
  async getCategoryById(@Param('id', ParseIntPipe) id: number): Promise<CategoryEntity> {
    return this.categoryService.getCategoryById(id);
  }

}
