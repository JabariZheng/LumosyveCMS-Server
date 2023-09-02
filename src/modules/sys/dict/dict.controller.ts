/*
 * @Author: ZhengJie
 * @Date: 2023-09-02 18:19:30
 * @Description: controller.dict
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DictService } from './dict.service';
import { ActionByIdDot, GetPageDto } from './dto/index.dto';
import { getControllerName } from 'src/utils';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';

@ApiTags('字典管理')
@Controller(getControllerName(__dirname))
export class DictController {
  constructor(private readonly dictService: DictService) {}

  @Post('add')
  add(@Body() createDictDto: CreateDictDto) {
    return this.dictService.create(createDictDto);
  }

  @Delete('delete')
  remove(@Body() query: ActionByIdDot) {
    console.log('query', query, query.id);
    return this.dictService.remove(+query.id);
  }

  @Patch('update')
  update(@Body() updateDictDto: UpdateDictDto) {
    return this.dictService.update(updateDictDto);
  }

  @Get('page')
  @ApiOperation({ summary: '分页' })
  getPage(@Query() page: GetPageDto) {
    return this.dictService.getPage(page);
  }

  @Get('list')
  @ApiOperation({ summary: '列表' })
  getList() {
    return this.dictService.getList();
  }

  @Get('info')
  @ApiOperation({ summary: '详情' })
  getInfo(@Query() query: ActionByIdDot) {
    return this.dictService.getInfo(+query.id);
  }
}
