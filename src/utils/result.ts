/*
 * @Author: ZhengJie
 * @Date: 2023-08-09 14:30:55
 * @Description: result
 */
import { ApiProperty } from '@nestjs/swagger';
export class ResultData {
  constructor(code = 200, msg?: string, data?: any) {
    this.code = code;
    this.msg = msg || 'ok';
    this.data = data || null;
  }

  @ApiProperty({ type: 'number', default: 200 })
  code: number;

  @ApiProperty({ type: 'string', default: 'ok' })
  msg?: string;

  data?: any;

  static ok(data?: any, msg?: string): ResultData {
    return new ResultData(200, msg, data);
  }

  static fail(code: number, msg?: string, data?: any): ResultData {
    return new ResultData(code || 500, msg || 'fail', data);
  }
}
