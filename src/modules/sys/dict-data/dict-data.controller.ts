/*
 * @Author: ZhengJie
 * @Date: 2023-09-17 23:34:13
 * @Description: dictData
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Query,
} from '@nestjs/common';
import { DictDataService } from './dict-data.service';
import { CreateDictDatumDto } from './dto/create-dict-datum.dto';
import { UpdateDictDatumDto } from './dto/update-dict-datum.dto';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ActionByIdDot } from '../dict/dto/index.dto';
import { GetPageDto, ListByType } from './dto/index.dto';
import { FormatDtoEmpty } from 'src/common/decorators/format-dto.decorator';

@ApiTags('字典数据管理')
@Controller('/sys/dict-data')
export class DictDataController {
  constructor(private readonly dictDataService: DictDataService) {}

  @Post('add')
  @ApiOperation({ summary: '新增' })
  add(@Body() createDictDatumDto: CreateDictDatumDto, @Headers() headers: any) {
    return this.dictDataService.add(createDictDatumDto, headers.authorization);
  }

  @Delete('delete')
  @ApiOperation({ summary: '删除' })
  remove(@Query() query: ActionByIdDot, @Headers() headers: any) {
    return this.dictDataService.remove(+query.id, headers.authorization);
  }

  @Patch('update')
  @ApiOperation({ summary: '更新' })
  update(
    @Body() updateDictDatumDto: UpdateDictDatumDto,
    @Headers() headers: any,
  ) {
    return this.dictDataService.update(
      updateDictDatumDto,
      headers.authorization,
    );
  }

  @Get('page')
  @ApiOperation({ summary: '分页' })
  getPage(@FormatDtoEmpty() page: GetPageDto) {
    return this.dictDataService.getPage(page);
  }

  @Get('list')
  @ApiOperation({ summary: '列表' })
  getList() {
    return this.dictDataService.getList();
  }

  @Get('listByType')
  @ApiOperation({ summary: '类型下的数据' })
  getListByType(@Query() query: ListByType) {
    return this.dictDataService.getListByType(query.dictType);
  }

  @Get('info')
  @ApiOperation({ summary: '详情' })
  getInfo(@Query() query: ActionByIdDot) {
    return this.dictDataService.getInfo(+query.id);
  }
}
