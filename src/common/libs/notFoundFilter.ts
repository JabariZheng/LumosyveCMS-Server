/*
 * @Author: ZhengJie
 * @Date: 2023-10-28 00:27:24
 * @Description: 文件Not Found 过滤器
 */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const statusCode = HttpStatus.NOT_FOUND;
    if (exception.code === 'ENOENT') {
      Logger.log(exception);
      response.status(statusCode).json({
        code: statusCode,
        msg: `Cannot ${request.method} ${request.url}`,
        error: 'Not Found',
      });
    } else {
      response.sendStatus(status);
    }
  }
}
