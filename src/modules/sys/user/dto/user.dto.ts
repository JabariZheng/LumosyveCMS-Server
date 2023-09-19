/*
 * @Author: ZhengJie
 * @Date: 2023-08-08 17:48:16
 * @Description: user.dto
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { number } from 'joi';

/**
 * 获取用户信息
 */
export class GetUserInfoDto {
  @IsString()
  @ApiProperty({ description: 'id' })
  @IsNotEmpty({ message: '请检查用户Id' })
  id: string;
}

/**
 * 用户分页
 */
export class GetUserPageDto {
  @ApiProperty({ type: 'number', description: '页数' })
  pageNo: number;

  @ApiProperty({ type: Number, description: '每页条数' })
  pageSize: number;

  @ApiProperty({ description: '账号', required: false })
  username: string;

  @ApiProperty({ description: '手机号码', required: false })
  mobile: string;

  @ApiProperty({ description: '账号状态', required: false })
  status: number;
}

export class ActionByIdDot {
  @IsString()
  @ApiProperty({ description: 'id' })
  @IsNotEmpty({ message: '请检查Id' })
  id: string;
}