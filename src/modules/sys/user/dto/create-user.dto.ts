/*
 * @Author: ZhengJie
 * @Date: 2023-08-06 23:49:40
 * @Description: user.create.dto
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({ message: '请检查用户名' })
  username: string;

  @IsString()
  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: '请检查密码' })
  password: string;

  @ApiProperty({ description: '昵称', required: false })
  nickname: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;

  @ApiProperty({ description: '角色', required: false })
  role_ids: string;

  @ApiProperty({ description: '部门', required: false })
  dept_id: number;

  @ApiProperty({ description: '岗位', required: false })
  post_ids: string;

  @ApiProperty({ description: '邮箱', required: false })
  email: string;

  @IsString()
  @ApiProperty({ description: '手机号码' })
  @IsNotEmpty({ message: '请检查手机号码' })
  mobile: string;

  @IsNumber()
  @ApiProperty({ description: '性别' })
  @IsNotEmpty({ message: '请检查性别' })
  sex: number;

  @ApiProperty({ description: '头像', required: false })
  avatar: string;

  @IsString()
  @ApiProperty({ description: '默认首页', required: false })
  home_url: string;

  @ApiProperty({ description: '账号状态', required: false })
  status: number;

  @ApiProperty({ description: '租户', required: false })
  tenant_id: number;
}
