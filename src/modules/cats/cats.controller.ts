/*
 * @Author: ZhengJie
 * @Date: 2023-07-27 22:27:55
 * @Description: cats.controller
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create.dto';
import { ListAllEntities } from './dto/get.dto';
import { UpdateCatDto } from './dto/update.dto';
import { CatsService } from './cats.service';
import { Cat } from './interface/cat.interface';
import { ValidationPipe } from 'src/pipe/validation.pipe';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  // @Header('Cache-Control', 'node')
  async create(@Body(new ValidationPipe()) createCatDto: CreateCatDto) {
    console.log('create body', createCatDto);
    const result = this.catsService.create(createCatDto);
    return result;
  }

  @Get()
  async findAll(@Query() query: ListAllEntities): Promise<Cat[]> {
    console.log('findAll query', query);
    return this.catsService.findAll();
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return `This action returns a #${id} cats`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDot: UpdateCatDto) {
    console.log('put id', id, 'put body', updateCatDot);
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} car`;
  }
}
