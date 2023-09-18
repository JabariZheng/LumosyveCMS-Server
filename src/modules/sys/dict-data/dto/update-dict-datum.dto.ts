/*
 * @Author: ZhengJie
 * @Date: 2023-09-17 23:34:13
 * @Description: dto.update
 */
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDictDatumDto } from './create-dict-datum.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateDictDatumDto extends PartialType(CreateDictDatumDto) {
  @ApiProperty({ description: 'id', required: true })
  @IsNumber()
  @IsNotEmpty({ message: '请检查id' })
  id: number;
}
