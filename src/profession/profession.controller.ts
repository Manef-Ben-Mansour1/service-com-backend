import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ProfessionService } from './profession.service';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { ProfessionEntity } from './entities/profession.entity';
import { UpdateProfessionDto } from './dto/update-profession.dto';
import { CategoryEntity } from '../category/entities/category.entity';

@Controller('profession')
export class ProfessionController {
  constructor(private  readonly  professionService:ProfessionService) {}
 @Post()
  async create(@Body() createProfessionDto: CreateProfessionDto): Promise<ProfessionEntity> {
    return this.professionService.createProfession(createProfessionDto);
  }

  @Patch(':id')
  async update(@Param('id',ParseIntPipe) id: number,@Body() updateProfessionDto: UpdateProfessionDto): Promise<ProfessionEntity> {
    return this.professionService.updateProfession(id,updateProfessionDto);
  }

  @Delete(':id')
  async delete(@Param('id',ParseIntPipe) id: number): Promise<ProfessionEntity> {
    return this.professionService.deleteProfession(id);
  }
  @Patch('recover/:id')
  async  recover(@Param('id',ParseIntPipe) id: number): Promise<ProfessionEntity> {
    return this.professionService.recoverProfession(id);
  }




}
