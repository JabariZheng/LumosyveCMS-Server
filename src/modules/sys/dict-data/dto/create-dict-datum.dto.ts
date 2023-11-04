/*
 * @Author: ZhengJie
 * @Date: 2023-09-17 23:34:13
 * @Description: dto.create
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDictDatumDto {
  @ApiProperty({ description: '字典标签', type: 'string', required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入字典标签' })
  label: string;

  @ApiProperty({ description: '字典键值', type: 'string', required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入字典键值' })
  value: string;

  @ApiProperty({ description: '字典类型', type: 'string', required: true })
  @IsString()
  @IsNotEmpty({ message: '请输入字典类型' })
  dictType: string;

  @ApiProperty({
    description: '状态（0正常 1停用）',
    type: 'number',
    required: true,
  })
  status: number; /* 状态（0正常 1停用） */

  @ApiProperty({ description: '字典排序' })
  sort: number;

  @ApiProperty({ description: '颜色类型', type: 'string' })
  colorType: string;

  @ApiProperty({ description: 'css 样式', type: 'string' })
  cssClass: string;

  @ApiProperty({ description: '备注', type: 'string' })
  remark: string;
}
