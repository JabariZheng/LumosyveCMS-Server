/*
 * @Author: ZhengJie
 * @Date: 2023-08-07 15:13:08
 * @Description: auth.service
 */
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { ResultData } from 'src/utils/result';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateTokenDto } from 'src/common/dto/common.dto';
import { CacheService } from 'src/modules/cache/cache.service';
import { instanceToPlain } from 'class-transformer';

// import MenuJSON from './json/menu';
import { UserService } from '../user/user.service';
import { CorpService } from '../corp/corp.service';
import { CatchErrors } from 'src/common/decorators/catch-error.decorator';

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
   * 生成token
   */
  public genToken(payload: { id: string; userName: string }): CreateTokenDto {
    const token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('jwt.expiresIn'),
    });
    return { token: `Bearer ${token}` };
  }

  /**
   * 校验token
   */
  public validToken(
    token: string,
  ): Promise<{ status: number; data: any; msg?: string }> {
    return new Promise(async (resolve) => {
      try {
        const result = await this.jwtService.verifyAsync(
          token.replace('Bearer ', ''),
        );
        resolve({ status: 200, data: result });
      } catch (error) {
        if (error.message.includes('jwt expired')) {
          // token过期
          resolve({ status: 401, data: null, msg: '登录已失效，请重新登录' });
        } else if (error.message.includes('invalid signature')) {
          // token无效
          resolve({ status: 401, data: null, msg: '无效令牌，请重新登录' });
        } else {
          resolve({ status: 401, data: null, msg: '登录已失效，请重新登录' });
        }
      }
    });
  }

  /**
   * 登录
   */
  @CatchErrors()
  public async login(loginParams: LoginDto) {
    // 查找租户（企业）
    const { data: corpData } = await this.corpService.getInfo(
      loginParams.corpCode,
    );

    if (Object.keys(corpData || {}).length === 0) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `租户${loginParams.corpCode}不存在`,
      );
    }
    // 查找用户，并同时返回密码
    const { data: userData } = await this.userService.getInfo(
      { loginCode: loginParams.loginCode },
      false,
    );

    if (Object.keys(userData || {}).length === 0) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `用户${loginParams.loginCode}不存在`,
      );
    }
    // 匹配密码
    if (userData.password !== loginParams.password) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '账号或密码错误',
      );
    }
    // 生成token
    const data = this.genToken({
      id: userData.id + '',
      userName: userData.userName,
    });
    // 写入redis，过期时间和jwt的过期时间同步
    await this.cacheService.set(
      `user_${userData.id}_${userData.userName}`,
      JSON.stringify(instanceToPlain(userData)),
      this.configService.get('jwt.expiresIn'),
    );
    return ResultData.ok({ ...data });
  }

  /**
   * 登出
   */
  public async logout(token: string) {
    if (token) {
      const { status, data, msg } = await this.validToken(token);
      if (status === 200) {
        await this.cacheService.del(`user_${data.id}_${data.userName}`);
      }
    }
    return ResultData.ok({});
  }

  /**
   * 获取当前登录用户信息
   */
  @CatchErrors('', true)
  public async getInfo(token: string) {
    const { status, data, msg } = await this.validToken(token);
    if (status === 401) {
      // return ResultData.fail(401, null, msg);
      throw new HttpException(msg, HttpStatus.UNAUTHORIZED);
    }
    let cacheData = await this.cacheService.get(
      `user_${data.id}_${data.userName}`,
    );
    // jwt验证已经登录，但是redis里没有了用户信息记录，则重新查询之后存起来
    if (!cacheData) {
      // 查找用户，并同时返回密码
      const { data: userData } = await this.userService.getInfo(
        { id: data.id },
        false,
      );
      if (userData && Object.keys(userData).length > 0) {
        cacheData = { ...userData };
        await this.cacheService.set(
          `user_${userData.id}_${userData.userName}`,
          JSON.stringify(userData),
          +this.configService.get('jwt.expiresIn'),
        );
      }
    } else {
      // redis中的都是json之后的
      cacheData = JSON.parse(cacheData);
    }
    return ResultData.ok({
      info: { ...cacheData, password: undefined },
      resources: [],
      permissions: [],
      roles: [],
    });
  }

  /**
   * 刷新token
   */
  @CatchErrors()
  public async refreshToken(token: string) {
    // const userData = await this.redisService.get(token);
    // if (!userData) {
    //   return ResultData.fail(401, 'token已失效');
    // }
    // const cacheData = JSON.parse(userData);
    // const newToken = this.jwtService.sign(
    //   JSON.stringify(cacheData),
    //   +this.configService.get('jwt.expiresIn'),
    // );
    // return ResultData.ok({
    //   token: newToken,
    // });
    return ResultData.ok({});
  }
}
