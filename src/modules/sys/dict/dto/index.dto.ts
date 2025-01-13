/*
 * @Author: ZhengJie
 * @Date: 2023-09-02 20:31:38
 * @Description: dto
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { QueryPageDto } from 'src/common/dto/common.dto';

export class GetPageDto extends QueryPageDto {
  @ApiProperty({ description: '字典名称', type: String, required: false })
  @IsString()
  dictName: string;

  @ApiProperty({ description: '字典类型', type: String, required: false })
  @IsString()
  dictType: string;

  @ApiProperty({ description: '状态', type: String, required: false })
  @IsString()
  status: string;
}

export class ActionByIdDot {
  @ApiProperty({ description: 'Id', type: 'String', required: true })
  @IsNotEmpty({ message: '请检查Id' })
  @IsString()
  id: string;
}
export class DelActionByIdsDot {
  @ApiProperty({ description: 'Id', type: 'Array', required: true })
  @IsNotEmpty({ message: '请检查Id' })
  @IsArray()
  ids: string[];

  @ApiProperty({
    description: '状态（0正常 1删除 2停用）',
    type: 'String',
  })
  status: string;
}
