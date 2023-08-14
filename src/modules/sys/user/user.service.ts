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
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CacheService } from 'src/modules/cache/cache.service';
import { ResultData } from 'src/utils/result';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { GetUserPageDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private cacheService: CacheService,
  ) {}

  /**
   * 查询信息
   */
  public async getInfo(id: string): Promise<ResultData> {
    const result = await this.findOne({ id: +id });
    return ResultData.ok(result ? instanceToPlain(result) : {});
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
      status: params.status || 0,
      username: params.username,
      mobile: params.mobile,
    };
    const result: [User[], number] = await this.queryUser({
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
    const result: [User[], number] = await this.queryUser({
      where: { status: 0 },
    });
    return ResultData.ok({
      list: instanceToPlain(result[0]),
      total: result[1],
    });
  }

  /**
   * 注册用户
   */
  public async registerUser(createUserDto: CreateUserDto) {
    // 查询是否存在用户名
    const getUser = await this.findOne({ username: createUserDto.username });
    console.log('getUser', getUser);
    if (Object.keys(getUser).length > 0) {
      return ResultData.fail(400, `已存在用户：${createUserDto.username}`);
    }
    console.log('createUserDto', createUserDto);
    // // 手动拼数据
    // let newUserData = {

    // }

    return ResultData.ok(instanceToPlain(getUser));
  }

  /**
   * 查询用户
   */
  private async queryUser(options: any): Promise<[User[], number]> {
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

  async create(createUserDto: CreateUserDto) {
    // // 开启事务
    // const queryRunner = this.dataSource.createQueryRunner()
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    // try {
    //   await queryRunner.manager.save
    // } catch (error) {
    // }
    return 'This action adds a new user';
  }

  async findAll(): Promise<User[]> {
    await this.cacheService.set('dddddd', '123');
    return await this.userRepository.query('select * from sys_user');
  }

  /**
   * 查找一个
   */
  public async findOne(opt: any): Promise<User> {
    let user = await this.userRepository.findOne({ where: opt });
    console.log('user', user);
    user = plainToInstance(
      User,
      { ...user },
      { enableImplicitConversion: true },
    );
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
