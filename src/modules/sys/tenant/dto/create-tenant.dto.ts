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
  contactUserId: string;

  @ApiProperty({ description: '联系人姓名' })
  contactName: string;

  @ApiProperty({ description: '联系人手机' })
  contactMobile: string;

  @ApiProperty({ description: '租户状态' })
  @IsNotEmpty({ message: '请检查租户状态' })
  status: string;

  @ApiProperty({ description: '绑定域名' })
  domain: string;

  @ApiProperty({ description: '租户套餐id' })
  packageId: string;

  @ApiProperty({ description: '过期时间' })
  expireTime: Date;

  @ApiProperty({ description: '账号数量' })
  accountCount: string;

  @ApiProperty({ description: '创建着' })
  creator: string;

  @ApiProperty({ description: '创建时间' })
  createTime: Date;

  @ApiProperty({ description: '更新者' })
  updater: string;

  @ApiProperty({ description: '更新时间' })
  updateTime: Date;

  @ApiProperty({ description: '是否删除' })
  // @IsNotEmpty({ message: '请检查租户是否删除' })
  deleted: string;

  @ApiProperty({ description: '删除时间' })
  deletedTime: Date | undefined;
}
