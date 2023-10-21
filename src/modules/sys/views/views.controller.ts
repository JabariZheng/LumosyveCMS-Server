/*
 * @Author: ZhengJie
 * @Date: 2023-08-29 00:00:54
 * @Description: controller.views
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ViewsService } from './views.service';
import { CreateViewDto } from './dto/create-view.dto';
import { UpdateViewDto } from './dto/update-view.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('页面管理')
@Controller('/sys/views')
export class ViewsController {
  constructor(private readonly viewsService: ViewsService) {}

  // @Post()
  // create(@Body() createViewDto: CreateViewDto) {
  //   return this.viewsService.create(createViewDto);
  // }

  // @Get()
  // findAll() {
  //   return this.viewsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.viewsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateViewDto: UpdateViewDto) {
  //   return this.viewsService.update(+id, updateViewDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.viewsService.remove(+id);
  // }
}
