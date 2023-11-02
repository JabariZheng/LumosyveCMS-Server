/*
 * @Author: ZhengJie
 * @Date: 2023-09-02 18:19:30
 * @Description: dto.create
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDictDto {
  @ApiProperty({ description: '字典名称', type: 'string', required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入字典名称' })
  name: string;

  @ApiProperty({ description: '字典类型', type: 'string', required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入字典类型' })
  type: string;

  @ApiProperty({ description: '状态（0正常 1停用）', type: 'number' })
  status: number;

  @ApiProperty({ description: '备注', type: 'string' })
  remark: string;

  // @ApiProperty({ description: '创建者', type: 'string' })
  // creator: string;

  // @ApiProperty({ description: '创建时间', type: 'string' })
  // create_time: string;

  // @ApiProperty({ description: '更新者', type: 'string' })
  // updater: string;

  // @ApiProperty({ description: '更新时间', type: 'string' })
  // update_time: string;

  // @ApiProperty({ description: '是否删除', type: 'string' })
  // deleted: string;

  // @ApiProperty({ description: '删除时间', type: 'string' })
  // deleted_time: string;
}
