/*
 * @Author: ZhengJie
 * @Date: 2023-08-11 16:58:41
 * @Description: 租户通用
 */
import { ApiProperty } from '@nestjs/swagger';
import { QueryPageDto } from 'src/common/dto/common.dto';

export class TenantPageDto extends QueryPageDto {
  @ApiProperty({ description: '租户名称', required: false })
  name: string;

  @ApiProperty({ description: '联系人姓名', required: false })
  contactName: string;

  @ApiProperty({ description: '联系人手机', required: false })
  contactMobile: string;

  @ApiProperty({ description: '租户状态', required: false })
  status: number;
}
