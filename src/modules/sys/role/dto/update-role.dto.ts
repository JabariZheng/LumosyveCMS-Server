/*
 * @Author: ZhengJie
 * @Date: 2023-10-18 23:12:58
 * @Description: dto.update
 */
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiProperty({ description: 'id', required: true })
  @IsNumber()
  @IsNotEmpty({ message: '请检查id' })
  id: number;
}
