import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ProfessionService } from './profession.service';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { ProfessionEntity } from './entities/profession.entity';
import { UpdateProfessionDto } from './dto/update-profession.dto';


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

  @Get()
  async getAllProfessions(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ): Promise<ProfessionEntity[]> {
    if (!page || !pageSize) {
      return this.professionService.getAllProfessions();
    }

    return this.professionService.getAllProfessionsWithPagination(+page, +pageSize);
  }

@Get(':id')
  async getProfessionById(@Param('id',ParseIntPipe) id: number): Promise<ProfessionEntity> {
    return this.professionService.getProfessionById(id);
  }




}
