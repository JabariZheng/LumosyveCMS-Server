/*
 * @Author: ZhengJie
 * @Date: 2023-08-09 01:06:59
 * @Description: auth.dto
 */
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @ApiProperty({ description: '租户' })
  @IsNotEmpty({ message: '请检查租户' })
  tenant: string;

  @IsString()
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({ message: '请检查用户名' })
  username: string;

  @IsString()
  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: '请检查密码' })
  password: string;
}
