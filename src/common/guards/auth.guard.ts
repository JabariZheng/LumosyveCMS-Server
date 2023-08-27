/*
 * @Author: ZhengJie
 * @Date: 2023-08-14 16:31:09
 * @Description: 权限守卫
 */

import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CacheService } from 'src/modules/cache/cache.service';
import { AuthService } from 'src/modules/sys/auth/auth.service';
import { ALLOW_ANON } from '../decorators/allow-anon.decorator';
import { ResultData } from 'src/utils/result';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(AuthService)
    private readonly authService: AuthService,
    @Inject(CacheService)
    private readonly cacheService: CacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowAnon = this.reflector.getAllAndOverride<boolean>(ALLOW_ANON, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (allowAnon) return true;
    const req = context.switchToHttp().getRequest();
    const accessToken = req.headers.authorization;
    if (!accessToken) throw new UnauthorizedException('请先登录');
    const auUserId = this.authService.validToken(accessToken);
    console.log('auUserId', auUserId);
    if (!auUserId) {
      // 过期自动删除
      await this.cacheService.del(accessToken.replace('Bearer ', ''));
      throw new UnauthorizedException('当前登录已过期，请重新登录');
    }
    return true;
  }
}
