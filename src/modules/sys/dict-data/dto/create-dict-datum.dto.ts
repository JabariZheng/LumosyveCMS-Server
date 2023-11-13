/*
 * @Author: ZhengJie
 * @Date: 2023-09-17 23:34:13
 * @Description: dto.create
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { formatValidationMessage } from 'src/utils/dto';

export class CreateDictDatumDto {
  @ApiProperty({ description: '字典标签', type: 'string', required: true })
  @IsString({
    message: ({ property }) => formatValidationMessage(property, 'string'),
  })
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

  // @ApiProperty({
  //   description: '状态（0正常 1停用）',
  //   type: 'number',
  //   required: true,
  // })
  // @IsNotEmpty({ message: '请输入状态' })
  // status: string | number | any; /* 状态（0正常 1停用） */

  @ApiProperty({ description: '字典排序' })
  sort: number;

  @ApiProperty({ description: '系统内置' })
  @IsNotEmpty({ message: '请输入是否系统内置' })
  isSys: string | number | any;

  @ApiProperty({ description: 'css 类名', type: 'string' })
  cssClass: string;

  @ApiProperty({ description: 'css 样式', type: 'string' })
  cssStyle: string;

  @ApiProperty({ description: '备注', type: 'string' })
  remark: string;
}
