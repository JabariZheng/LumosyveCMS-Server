/*
 * @Author: ZhengJie
 * @Date: 2023-08-11 15:29:33
 * @Description: tenant.entity
 */
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { formatDate } from 'src/utils';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sys_tenant')
export class Tenant {
  @PrimaryColumn({ comment: '租户id' })
  @ApiProperty({ description: '租户id' })
  id: number;

  @Column({ comment: '租户名称' })
  @ApiProperty({ description: '租户名称' })
  name: string;

  @Column({ name: 'contact_user_id', comment: '联系人id' })
  @ApiProperty({ description: '联系人id' })
  contactUserId: string;

  @Column({ name: 'contact_name', comment: '联系人姓名' })
  @ApiProperty({ description: '联系人姓名' })
  contactName: string;

  @Column({ name: 'contact_mobile', comment: '联系人手机' })
  @ApiProperty({ description: '联系人手机' })
  contactMobile: string;

  @Column({ comment: '租户状态' })
  @ApiProperty({ description: '租户状态' })
  status: string;

  @Column({ comment: '绑定域名' })
  @ApiProperty({ description: '绑定域名' })
  domain: string;

  @Column({ name: 'package_id', comment: '租户套餐id' })
  @ApiProperty({ description: '租户套餐id' })
  packageId: string;

  @Column({ name: 'expire_time', comment: '过期时间' })
  @ApiProperty({ description: '过期时间' })
  @Transform(({ value }) => formatDate(value))
  expireTime: Date;

  @Column({ name: 'account_count', comment: '账号数量' })
  @ApiProperty({ description: '账号数量' })
  accountCount: string;

  @Column({ comment: '创建着' })
  @ApiProperty({ description: '创建着' })
  creator: string;

  @Column({ name: 'create_time', comment: '创建时间' })
  @ApiProperty({ description: '创建时间' })
  @Transform(({ value }) => formatDate(value))
  createTime: Date;

  @Column({ comment: '更新者' })
  @ApiProperty({ description: '更新者' })
  updater: string;

  @Column({ name: 'update_time', comment: '更新时间' })
  @ApiProperty({ description: '更新时间' })
  @Transform(({ value }) => formatDate(value))
  updateTime: Date;

  @Column({ comment: '是否删除' })
  @ApiProperty({ description: '是否删除' })
  deleted: string;

  @Column({ name: 'deleted_time', comment: '删除时间' })
  @ApiProperty({ description: '删除时间' })
  @Transform(({ value }) => value && formatDate(value))
  deletedTime: Date | undefined;
}
