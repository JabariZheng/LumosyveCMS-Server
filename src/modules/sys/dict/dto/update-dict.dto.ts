/*
 * @Author: ZhengJie
 * @Date: 2023-09-02 18:19:30
 * @Description: dto.update
 */
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDictDto } from './create-dict.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateDictDto extends PartialType(CreateDictDto) {
  @ApiProperty({ description: 'id', required: true })
  @IsNumber()
  @IsNotEmpty({ message: '请检查id' })
  id: number;
}
