import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProfessionService } from './profession.service';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { ProfessionEntity } from './entities/profession.entity';
import { UpdateProfessionDto } from './dto/update-profession.dto';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { AdminGuard } from '../user/guards/admin.guard';


@Controller('profession')
export class ProfessionController {
  constructor(private  readonly  professionService:ProfessionService) {}
  @UseGuards(JwtAuthGuard, AdminGuard)
 @Post()
  async create(@Body() createProfessionDto: CreateProfessionDto): Promise<ProfessionEntity> {
    return this.professionService.createProfession(createProfessionDto);
  }
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  async update(@Param('id',ParseIntPipe) id: number,@Body() updateProfessionDto: UpdateProfessionDto): Promise<ProfessionEntity> {
    return this.professionService.updateProfession(id,updateProfessionDto);
  }
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async delete(@Param('id',ParseIntPipe) id: number): Promise<ProfessionEntity> {
    return this.professionService.deleteProfession(id);
  }
  @UseGuards(JwtAuthGuard, AdminGuard)
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
