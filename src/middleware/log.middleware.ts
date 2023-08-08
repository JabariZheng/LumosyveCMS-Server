/*
 * @Author: ZhengJie
 * @Date: 2023-07-28 09:46:44
 * @Description: middleware.log
 */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { formatDate } from 'src/utils';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(
      `LoggerMiddleware ${formatDate(new Date())} Request: ${req.method} ${
        req.url
      }`,
    );
    next();
  }
}
