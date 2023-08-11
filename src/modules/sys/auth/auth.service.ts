/*
 * @Author: ZhengJie
 * @Date: 2023-08-07 15:13:08
 * @Description: auth.service
 */
import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/auth.dto';
import { ResultData } from 'src/utils/result';

@Injectable()
export class AuthService {
  /**
   * 登录
   */
  login(loginParams: LoginDto) {
    console.log('loginParams', loginParams);
    return ResultData.ok({});
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
