import { Body, Controller, Post } from '@nestjs/common';
import { ProfessionService } from './profession.service';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { ProfessionEntity } from './entities/profession.entity';

@Controller('profession')
export class ProfessionController {
  constructor(private  readonly  professionService:ProfessionService) {}
 @Post()
  async create(@Body() createProfessionDto: CreateProfessionDto): Promise<ProfessionEntity> {
    return this.professionService.createProfession(createProfessionDto);
  }



}
