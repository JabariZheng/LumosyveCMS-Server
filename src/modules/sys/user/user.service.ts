/*
 * @Author: ZhengJie
 * @Date: 2023-08-06 23:49:40
 * @Description: user.service
 */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CacheService } from 'src/modules/cache/cache.service';
import { ResultData } from 'src/utils/result';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { GetUserPageDto } from './dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { snowflakeID } from 'src/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * 新增
   */
  public async create(
    dto: CreateUserDto,
    authorization: string,
  ): Promise<ResultData> {
    const result = await this.findOne({ name: dto.username });
    if (
      Object.keys(instanceToPlain(result)).length > 0 &&
      instanceToPlain(result).deleted === '0'
    ) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `已存在${dto.username}`,
      );
    }

    const auUserId = this.authService.validToken(authorization);
    const currentUser = await this.cacheService.get(auUserId);
    const newData: User = {
      status: '0',
      ...dto,
      id: snowflakeID.NextId() as number,
      deleted: '0',
      creator: JSON.parse(currentUser).username,
      create_time: new Date(),
      update_time: new Date(),
      updater: JSON.parse(currentUser).username,
      deleted_time: undefined,
      login_ip: undefined,
      login_date: undefined,
    };
    await this.userRepository.save(newData);
    return ResultData.ok(newData, '操作成功');
  }

  /**
   * 删除
   */
  public async remove(id: number): Promise<ResultData> {
    if (!id) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查id',
      );
    }
    let result = await this.findOne({ id: +id });
    result = instanceToPlain(result) as User;
    result.deleted = '1';
    result.deleted_time = new Date();
    await this.userRepository.save(result);
    return ResultData.ok(result, '操作成功');
  }

  /**
   * 更新
   */
  public async update(updateUserDto: UpdateUserDto, authorization: string) {
    if (!updateUserDto.id) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查id',
      );
    }
    const result = await this.findOne({ id: +updateUserDto.id });
    if (!result) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `未查询到${updateUserDto.id}，请检查id`,
      );
    }
    const auUserId = this.authService.validToken(authorization);
    const currentUser = await this.cacheService.get(auUserId);
    const newData = {
      ...instanceToPlain(result),
      ...updateUserDto,
      id: +updateUserDto.id,
      update_time: new Date(),
      updater: JSON.parse(currentUser).username,
    };
    await this.userRepository.save(newData);
    return ResultData.ok(newData, '操作成功');
  }

  /**
   * 分页
   */
  public async getUserPage(dto: GetUserPageDto): Promise<ResultData> {
    const params: GetUserPageDto = {
      ...dto,
      pageNo: dto.pageNo ? +dto.pageNo : 1,
      pageSize: dto.pageSize ? +dto.pageSize : 15,
    };
    const where = {
      deleted: params.status === '2' ? '1' : '0',
      status: params.status === '2' ? undefined : params.status,
      username: params.username,
      mobile: params.mobile,
    };
    const result: [User[], number] = await this.queryCount({
      where,
      order: { update_time: 'DESC' },
      skip: (params.pageNo - 1) * params.pageSize,
      take: params.pageSize,
    });
    return ResultData.ok({
      list: instanceToPlain(result[0]),
      total: result[1],
      pageNo: params.pageNo,
      pageSize: params.pageSize,
    });
  }

  /**
   * 查询用户列表
   */
  public async getUserList() {
    const result: [User[], number] = await this.queryCount({
      where: { status: '0', deleted: '0' },
    });
    return ResultData.ok({
      list: instanceToPlain(result[0]),
      total: result[1],
    });
  }

  /**
   * 查询信息
   */
  public async getInfo(id: number): Promise<ResultData> {
    const result = await this.findOne({ id: +id });
    return ResultData.ok(result ? instanceToPlain(result) : {});
  }

  /**
   * 注册用户
   */
  // public async registerUser(createUserDto: CreateUserDto) {
  //   // 查询是否存在用户名
  //   const getUser = await this.findOne({ username: createUserDto.username });
  //   console.log('getUser', getUser);
  //   if (Object.keys(getUser).length > 0) {
  //     return ResultData.fail(400, `已存在用户：${createUserDto.username}`);
  //   }
  //   console.log('createUserDto', createUserDto);
  //   // // 手动拼数据
  //   // let newUserData = {

  //   // }

  //   return ResultData.ok(instanceToPlain(getUser));
  // }

  /**
   * 查询用户
   */
  private async queryCount(options: any): Promise<[User[], number]> {
    const repositoryOptions: FindManyOptions<User> = {
      order: { update_time: 'DESC' },
      ...options,
    };
    const result: [User[], number] = await this.userRepository.findAndCount(
      repositoryOptions,
    );
    const data: User[] = plainToInstance(User, result[0], {
      enableImplicitConversion: true,
    });
    return [data, result[1]];
  }

  /**
   * 查找一个
   */
  public async findOne(opt: any): Promise<User> {
    let user = await this.userRepository.findOne({ where: opt });
    user = plainToInstance(
      User,
      { ...user },
      { enableImplicitConversion: true },
    );
    return user;
  }

  // async create(createUserDto: CreateUserDto) {
  //   // // 开启事务
  //   // const queryRunner = this.dataSource.createQueryRunner()
  //   // await queryRunner.connect();
  //   // await queryRunner.startTransaction();
  //   // try {
  //   //   await queryRunner.manager.save
  //   // } catch (error) {
  //   // }
  //   return 'This action adds a new user';
  // }
}
