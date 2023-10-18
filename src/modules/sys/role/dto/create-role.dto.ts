/*
 * @Author: ZhengJie
 * @Date: 2023-10-18 23:12:58
 * @Description: dto.create
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称', type: 'string', required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入角色名称' })
  name: string;

  @ApiProperty({ description: '角色编码', type: 'string', required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入角色编码' })
  code: string;

  @ApiProperty({
    description: '是否为系统角色',
    type: 'number',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty({ message: '请选择是否为系统角色' })
  is_system_role: number;

  @ApiProperty({ description: '备注', type: 'string' })
  remark: string;

  @ApiProperty({ description: '状态（0正常 1停用）', type: 'number' })
  status: number;

  @ApiProperty({ description: '创建者', type: 'string' })
  creator: string;

  @ApiProperty({ description: '创建时间', type: 'string', format: 'date-time' })
  create_time: Date;

  @ApiProperty({ description: '更新者', type: 'string' })
  updater: string;

  @ApiProperty({ description: '更新时间', type: 'string', format: 'date-time' })
  update_time: Date;

  @ApiProperty({ description: '是否删除', type: 'number' })
  deleted: number;

  @ApiProperty({ description: '删除时间', type: 'string', format: 'date-time' })
  deleted_time: Date;
}
