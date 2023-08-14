/*
 * @Author: ZhengJie
 * @Date: 2023-08-11 15:29:33
 * @Description: 更新租户dto
 */
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTenantDto } from './create-tenant.dto';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateTenantDto extends PartialType(CreateTenantDto) {
  @IsNumber()
  @ApiProperty({ description: 'id' })
  @IsNotEmpty({ message: '请检查租户Id' })
  id: number;
}
