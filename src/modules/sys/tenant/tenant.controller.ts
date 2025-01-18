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
  Headers,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TenantPageDto } from './dto/common-tenant.dto';
import { ResultData } from 'src/utils/result';
import { ActionByIdDot } from './dto/index.dto';

@ApiTags('🚫租户管理-废弃')
@Controller('/sys/tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post('add')
  @ApiOperation({ summary: '新增租户' })
  create(@Body() createTenantDto: CreateTenantDto, @Headers() headers: any) {
    return this.tenantService.create(createTenantDto, headers.authorization);
  }

  @Delete('delete')
  @ApiOperation({ summary: '租户删除' })
  remove(@Query() query: ActionByIdDot) {
    return this.tenantService.remove(+query.id);
  }

  @Patch('update')
  @ApiOperation({ summary: '租户更新' })
  update(@Body() updateTenantDto: UpdateTenantDto, @Headers() headers: any) {
    return this.tenantService.update(updateTenantDto, headers.authorization);
  }

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

  @Get('info')
  @ApiOperation({ summary: '租户查询' })
  getTenantInfo(@Param('id') id: number) {
    return this.tenantService.getTenantInfo(+id);
  }
}
