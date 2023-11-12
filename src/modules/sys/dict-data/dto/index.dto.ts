/*
 * @Author: ZhengJie
 * @Date: 2023-09-02 20:31:38
 * @Description: dto
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { QueryPageDto } from 'src/common/dto/common.dto';

export class GetPageDto extends QueryPageDto {
  @ApiProperty({ description: '字典类型', type: String, required: false })
  @IsNotEmpty({ message: '请检查字典类型' })
  type: string;
  @ApiProperty({ description: '字典名称', type: String, required: false })
  label: string;
  @ApiProperty({ description: '字典键值', type: String, required: false })
  value: string;
  @ApiProperty({ description: '系统内置', type: Number, required: false })
  isSys: number;
  @ApiProperty({ description: '状态', type: Number, required: false })
  status: number;
}

export class ActionByIdDot {
  // @IsString()
  @ApiProperty({ description: 'id' })
  @IsNotEmpty({ message: '请检查Id' })
  id: string | number | any;
}

export class ListByType {
  @IsString()
  @ApiProperty({ description: '字典类型' })
  @IsNotEmpty({ message: '请检查字典类型' })
  dictType: string;
}
