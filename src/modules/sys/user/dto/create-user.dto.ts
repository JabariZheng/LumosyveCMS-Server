/*
 * @Author: ZhengJie
 * @Date: 2023-08-06 23:49:40
 * @Description: user.create.dto
 */
import { IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  nickname: string;

  @IsString()
  remark: string;

  @IsNumber()
  dept_id: number;

  @IsString()
  post_ids: string;

  @IsString()
  email: string;

  @IsString()
  mobile: string;

  @IsNumber()
  sex: number;

  @IsString()
  avatar: string;

  @IsNumber()
  status: number;

  @IsNumber()
  deleted: number;

  @IsNumber()
  tenant_id: number;

  @IsString()
  login_ip: string;

  @IsString()
  login_date: string;

  @IsString()
  creator: string;

  @IsString()
  create_time: string;

  @IsString()
  updater: string;

  @IsString()
  update_time: string;
}
