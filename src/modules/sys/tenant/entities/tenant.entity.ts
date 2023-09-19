/*
 * @Author: ZhengJie
 * @Date: 2023-08-11 15:29:33
 * @Description: tenant.entity
 */
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sys_tenant')
export class Tenant {
  @PrimaryColumn({ comment: '租户id' })
  @ApiProperty({ description: '租户id' })
  id: number;

  @Column({ comment: '租户名称' })
  @ApiProperty({ description: '租户名称' })
  name: string;

  @Column({ comment: '联系人id' })
  @ApiProperty({ description: '联系人id' })
  contact_user_id: number;

  @Column({ comment: '联系人姓名' })
  @ApiProperty({ description: '联系人姓名' })
  contact_name: string;

  @Column({ comment: '联系人手机' })
  @ApiProperty({ description: '联系人手机' })
  contact_mobile: string;

  @Column({ comment: '租户状态' })
  @ApiProperty({ description: '租户状态' })
  status: number;

  @Column({ comment: '绑定域名' })
  @ApiProperty({ description: '绑定域名' })
  domain: string;

  @Column({ comment: '租户套餐id' })
  @ApiProperty({ description: '租户套餐id' })
  package_id: number;

  @Column({ comment: '过期时间' })
  @ApiProperty({ description: '过期时间' })
  expire_time: string;

  @Column({ comment: '账号数量' })
  @ApiProperty({ description: '账号数量' })
  account_count: number;

  @Column({ comment: '创建着' })
  @ApiProperty({ description: '创建着' })
  creator: string;

  @Column({ comment: '创建时间' })
  @ApiProperty({ description: '创建时间' })
  create_time: string;

  @Column({ comment: '更新者' })
  @ApiProperty({ description: '更新者' })
  updater: string;

  @Column({ comment: '更新时间' })
  @ApiProperty({ description: '更新时间' })
  update_time: string;

  @Column({ comment: '是否删除' })
  @ApiProperty({ description: '是否删除' })
  deleted: number;

  @Column({ comment: '删除时间' })
  @ApiProperty({ description: '删除时间' })
  deleted_time: string;
}
