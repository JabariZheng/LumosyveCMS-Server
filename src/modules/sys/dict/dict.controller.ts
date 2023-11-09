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
  Delete,
  Query,
  Headers,
} from '@nestjs/common';
import { DictService } from './dict.service';
import { ActionByIdDot, GetPageDto } from './dto/index.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { FormatDtoEmpty } from 'src/common/decorators/format-dto.decorator';

@ApiTags('字典管理')
@Controller('/sys/dict')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  @Post('add')
  @ApiOperation({ summary: '新增' })
  add(@Body() createDictDto: CreateDictDto, @Headers() headers: any) {
    return this.dictService.create(createDictDto, headers.authorization);
  }

  @Delete('delete')
  @ApiOperation({ summary: '删除' })
  remove(@Body() query: ActionByIdDot, @Headers() headers: any) {
    return this.dictService.remove(+query.id, headers.authorization);
  }

  @Patch('update')
  @ApiOperation({ summary: '更新' })
  update(@Body() updateDictDto: UpdateDictDto, @Headers() headers: any) {
    return this.dictService.update(updateDictDto, headers.authorization);
  }

  @Get('page')
  @ApiOperation({ summary: '分页' })
  getPage(@FormatDtoEmpty() page: GetPageDto) {
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
