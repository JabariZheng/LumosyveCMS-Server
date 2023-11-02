/*
 * @Author: ZhengJie
 * @Date: 2023-11-02 22:32:35
 * @Description: 格式化没有值的参数
 */
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const FormatDtoEmpty = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    let targetParams = {};
    switch (req.method) {
      case 'GET':
      case 'DELETE':
        targetParams = { ...req.query };
        break;
      case 'POST':
      case 'PUT':
        targetParams = { ...req.body };
        break;

      default:
        break;
    }

    const result = {};
    Object.keys(targetParams).map((key: string) => {
      if (targetParams[key] || targetParams[key].length > 0) {
        result[key] = targetParams[key];
      }
    });
    return result;
  },
);
