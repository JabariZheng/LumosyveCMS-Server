/*
 * @Author: ZhengJie
 * @Date: 2024-09-07 22:56:54
 * @LastEditTime: 2024-11-20 16:52:07
 * @Description: 捕获错误
 */
import { HttpException, HttpStatus } from '@nestjs/common';
import { Logger } from 'src/common/libs/log4js/log4js';

export function CatchErrors(
  customMessage = '服务器异常，请稍后重试',
): MethodDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        // 调用原始方法
        return await originalMethod.apply(this, args);
      } catch (error) {
        // 捕获错误并记录日志
        Logger.error(
          `Catch Error in ${target.constructor.name}.${String(propertyKey)}: ${
            error.message
          }`,
          error.stack,
        );

        throw new HttpException(
          {
            success: false,
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            msg: customMessage,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
        // throw error; // 继续抛出异常以便上层处理
      }
    };
    return descriptor;
  };
}
