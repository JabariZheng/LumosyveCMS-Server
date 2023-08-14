/*
 * @Author: ZhengJie
 * @Date: 2023-08-14 16:31:09
 * @Description: 权限守卫
 */
import {
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { CacheService } from 'src/modules/cache/cache.service';
import { AuthService } from 'src/modules/sys/auth/auth.service';
import { ALLOW_ANON } from '../decorators/allow-anon.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    @Inject(AuthService)
    private readonly authService: AuthService,
    @Inject(CacheService)
    private readonly cacheService: CacheService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowAnon = this.reflector.getAllAndOverride<boolean>(ALLOW_ANON, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (allowAnon) return true;
    const req = context.switchToHttp().getRequest();
    const accessToken = req.get('Authorization');
    if (!accessToken) throw new ForbiddenException('请先登录');
    const auUserId = this.authService.validToken(accessToken);
    if (!auUserId) {
      // 过期自动删除
      await this.cacheService.del(accessToken.replace('Bearer ', ''));
      throw new UnauthorizedException('当前登录已过期，请重新登录');
    }
    return this.activate(context);
  }

  async activate(ctx: ExecutionContext): Promise<boolean> {
    return super.canActivate(ctx) as Promise<boolean>;
  }
}
