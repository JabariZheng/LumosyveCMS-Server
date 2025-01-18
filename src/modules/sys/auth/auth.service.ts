/*
 * @Author: ZhengJie
 * @Date: 2023-08-07 15:13:08
 * @Description: auth.service
 */
import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/auth.dto';
import { ResultData } from 'src/utils/result';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateTokenDto } from 'src/common/dto/common.dto';
import { CacheService } from 'src/modules/cache/cache.service';
import { instanceToPlain } from 'class-transformer';
import { User } from '../user/entities/user.entity';

import MenuJSON from './json/menu';
import { UserService } from '../user/user.service';
import { CorpService } from '../corp/corp.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => CorpService))
    private readonly corpService: CorpService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * 登录
   */
  public async login(loginParams: LoginDto) {
    try {
      // 查找租户
      const getTenant = await this.corpService.getInfo(loginParams.tenant);
      if (Object.keys(instanceToPlain(getTenant || {})).length === 0) {
        return ResultData.fail(
          this.configService.get('errorCode.valid'),
          `租户${loginParams.tenant}不存在`,
        );
      }
      // 查找用户
      const getUser = await this.userService.findOne({
        username: loginParams.username,
      });
      if (Object.keys(instanceToPlain(getUser || {})).length === 0) {
        return ResultData.fail(
          this.configService.get('errorCode.valid'),
          `用户${loginParams.username}不存在`,
        );
      }
      // 匹配密码
      // if (getUser.password !== atob(loginParams.password)) {
      if (getUser.password !== loginParams.password) {
        return ResultData.fail(
          this.configService.get('errorCode.valid'),
          '账号或密码错误',
        );
      }
      // 生成token
      const data = this.genToken({ id: getUser.id + '' });
      // 写入redis，过期时间暂时先不写，有jwt的过期时间校验，过期自动清除
      await this.cacheService.set(
        `user_${getUser.id}`,
        JSON.stringify(instanceToPlain(getUser)),
      );
      return ResultData.ok(data);
    } catch (error) {
      console.log('error', error);
    }
  }

  /**
   * 登出
   */
  public async logout(token: string) {
    const id = this.validToken(token);
    if (!id) {
      throw new UnauthorizedException('登录已失效，请重新登录');
    }
    await this.cacheService.del(id + '');
    return ResultData.ok({});
  }

  /**
   * 生成token
   */
  public genToken(payload: { id: string }): CreateTokenDto {
    const token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('jwt.refreshExpiresIn'),
    });
    const accessToken = `Bearer ${token}`;
    const refreshToken = token;
    console.log('genToken', token);
    return { token, accessToken, refreshToken };
  }

  /**
   * 校验token
   */
  public async validToken(token: string): Promise<string> {
    try {
      const isPermission = await this.configService.get('app.permission');
      if (!isPermission) return '';
      if (isPermission && !token) {
        throw new UnauthorizedException('登录已失效，请重新登录');
      }
      const { id } = this.jwtService.verify(token.replace('Bearer ', ''));
      return id;
    } catch (error) {
      console.log('validToken:error', error);
      throw new UnauthorizedException('登录已失效，请重新登录');
      // return '';
    }
  }

  /**
   * 获取当前登录用户信息
   */
  public async getInfo(token: string) {
    const id = this.validToken(token);
    if (!id) {
      throw new UnauthorizedException('登录已失效，请重新登录');
    }
    let cacheData = await this.cacheService.get(`user_${id}`);
    // jwt验证已经登录，但是redis里没有了用户信息记录，则重新查询之后存起来
    if (!cacheData) {
      // const getUser = await this.userRepository.findOne({
      //   where: { id: +id },
      // });
      const getUser = await this.userService.findOne({
        where: { id: +id },
      });
      cacheData = JSON.stringify(instanceToPlain(getUser));
      await this.cacheService.set(id + '', cacheData);
    }
    return ResultData.ok({ info: JSON.parse(cacheData), resources: [] });
  }

  /**
   * 获取当前登录用户信息（TODO）
   */
  public async getPermissions(token: string) {
    const id = this.validToken(token);
    if (!id) {
      throw new UnauthorizedException('登录已失效，请重新登录');
    }
    let cacheData = await this.cacheService.get(`user_${id}`);
    // jwt验证已经登录，但是redis里没有了用户信息记录，则重新查询之后存起来
    if (!cacheData) {
      // const getUser = await this.userRepository.findOne({
      //   where: { id: +id },
      // });
      const getUser = await this.userService.findOne({
        where: { id: +id },
      });
      cacheData = JSON.stringify(instanceToPlain(getUser));
    }
    const getCurrentInfo: User = JSON.parse(cacheData);
    return ResultData.ok({
      stringPermissions: [],
      roles: getCurrentInfo.role_ids || [],
    });
  }

  /**
   * 获取当前登录用户菜单数据（TODO）
   */
  public async getMenuRoute(token: string) {
    const id = this.validToken(token);
    if (!id) {
      throw new UnauthorizedException('登录已失效，请重新登录');
    }

    let count = 0;

    const eachMenuJson = (data) => {
      return data.map((item: any) => {
        count++;
        item.id = count;
        if (item.children) {
          item.children = eachMenuJson(item.children);
        }
        return item;
      });
    };
    const menu = eachMenuJson(MenuJSON);
    return ResultData.ok(menu);
  }
}
