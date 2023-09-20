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
  type: string;
  @ApiProperty({ description: '字典名称', type: String, required: false })
  name: string;
  @ApiProperty({ description: '字典键值', type: String, required: false })
  value: string;
  @ApiProperty({ description: '状态', type: String, required: false })
  status: string;
}

export class ActionByIdDot {
  @IsString()
  @ApiProperty({ description: 'id' })
  @IsNotEmpty({ message: '请检查Id' })
  id: string;
}

export class ListByType {
  @IsString()
  @ApiProperty({ description: '字典类型' })
  @IsNotEmpty({ message: '请检查字典类型' })
  type: string;
}
