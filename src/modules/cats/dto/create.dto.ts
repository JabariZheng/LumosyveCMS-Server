/*
 * @Author: ZhengJie
 * @Date: 2023-07-27 22:38:20
 * @Description: cats.create.dto
 */

import { IsNumber, IsString } from 'class-validator';

export class CreateCatDto {
  @IsString()
  name: string;

  @IsNumber()
  age: number;

  @IsString()
  bread: string;
}
