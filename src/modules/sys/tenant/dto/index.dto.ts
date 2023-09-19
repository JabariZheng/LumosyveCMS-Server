/*
 * @Author: ZhengJie
 * @Date: 2023-09-20 00:05:39
 * @Description: dto
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ActionByIdDot {
  @IsString()
  @ApiProperty({ description: 'id' })
  @IsNotEmpty({ message: '请检查Id' })
  id: string;
}
