/*
 * @Author: ZhengJie
 * @Date: 2023-07-28 14:31:29
 * @Description: middleware.login
 */
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    console.log('is login valid');
    next();
  }
}
