/*
 * @Author: ZhengJie
 * @Date: 2023-08-11 15:29:33
 * @Description: 创建租户dto
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @ApiProperty({ description: '租户名称' })
  @IsNotEmpty({ message: '请检查租户名称' })
  name: string;

  @ApiProperty({ description: '联系人id' })
  contact_user_id: number;

  @ApiProperty({ description: '联系人姓名' })
  contact_name: string;

  @ApiProperty({ description: '联系人手机' })
  contact_mobile: string;

  @IsNumber()
  @ApiProperty({ description: '租户状态' })
  @IsNotEmpty({ message: '请检查租户状态' })
  status: number;

  @ApiProperty({ description: '绑定域名' })
  domain: string;

  @ApiProperty({ description: '租户套餐id' })
  package_id: number;

  @ApiProperty({ description: '过期时间' })
  expire_time: number;

  @ApiProperty({ description: '账号数量' })
  account_count: number;

  @ApiProperty({ description: '创建着' })
  creator: string;

  @ApiProperty({ description: '创建时间' })
  create_time: number;

  @ApiProperty({ description: '更新者' })
  updater: string;

  @ApiProperty({ description: '更新时间' })
  update_time: number;

  // @IsNumber()
  @ApiProperty({ description: '是否删除' })
  // @IsNotEmpty({ message: '请检查租户是否删除' })
  deleted: number;
}
