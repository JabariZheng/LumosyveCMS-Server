/*
 * @Author: ZhengJie
 * @Date: 2023-08-11 15:29:33
 * @Description: tenant.controller
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
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { getControllerName } from 'src/utils';
import { TenantPageDto } from './dto/common-tenant.dto';
import { ResultData } from 'src/utils/result';

@ApiTags('租户管理')
@Controller(getControllerName(__dirname))
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get('page')
  @ApiOperation({ summary: '租户分页' })
  getTenantPage(@Query() dto: TenantPageDto): Promise<ResultData> {
    return this.tenantService.getTenantPage(dto);
  }

  @Get('list')
  @ApiOperation({ summary: '租户列表' })
  getTanantList() {
    return this.tenantService.getTanantList();
  }

  @Post('add')
  @ApiOperation({ summary: '新增租户' })
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantService.create(createTenantDto);
  }

  @Get('info')
  @ApiOperation({ summary: '租户查询' })
  getTenantInfo(@Param('id') id: number) {
    return this.tenantService.getTenantInfo(+id);
  }

  @Patch('update')
  @ApiOperation({ summary: '租户更新' })
  update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    return this.tenantService.update(+id, updateTenantDto);
  }

  @Delete('delete')
  @ApiOperation({ summary: '租户删除' })
  remove(@Param('id') id: string) {
    return this.tenantService.remove(+id);
  }
}
