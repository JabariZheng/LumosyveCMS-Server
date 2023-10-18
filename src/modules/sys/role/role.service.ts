/*
 * @Author: ZhengJie
 * @Date: 2023-10-18 23:12:58
 * @Description: role.service
 */
import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { CacheService } from 'src/modules/cache/cache.service';
import { ResultData } from 'src/utils/result';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { snowflakeID } from 'src/utils';
import { GetPageDto } from './dto/index.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * 新增
   */
  public async create(
    createDto: CreateRoleDto,
    authorization: string,
  ): Promise<ResultData> {
    const result = await this.findOne({ name: createDto.name });
    if (
      Object.keys(instanceToPlain(result)).length > 0 &&
      instanceToPlain(result).deleted === '0'
    ) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `已存在${createDto.name}`,
      );
    }

    const auUserId = this.authService.validToken(authorization);
    const currentUser = await this.cacheService.get(auUserId);
    // 自动获取当前顺序
    const { data } = await this.getList();
    const newData: Role = {
      status: 0,
      ...createDto,
      id: snowflakeID.NextId() as number,
      deleted: 0,
      sort: data.total++,
      creator: JSON.parse(currentUser).username,
      create_time: new Date(),
      update_time: new Date(),
      updater: JSON.parse(currentUser).username,
    };
    await this.roleRepository.save(newData);
    return ResultData.ok(newData, '操作成功');
  }

  /**
   * 删除
   */
  public async remove(id: number) {
    if (!id) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查id',
      );
    }
    // 自身删除
    let result = await this.findOne({ id: +id });
    result = instanceToPlain(result) as Role;
    result.deleted = 1;
    result.deleted_time = new Date();
    await this.roleRepository.save(result);
    return ResultData.ok(result, '操作成功');
  }

  /**
   * 更新
   */
  public async update(updateDto: UpdateRoleDto, authorization: string) {
    if (!updateDto.id) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查id',
      );
    }
    const result = await this.findOne({ id: +updateDto.id });
    if (!result) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `未查询到${updateDto.id}，请检查id`,
      );
    }
    const auUserId = this.authService.validToken(authorization);
    const currentUser = await this.cacheService.get(auUserId);
    const newData = {
      ...instanceToPlain(result),
      ...updateDto,
      id: +updateDto.id,
      update_time: new Date(),
      updater: JSON.parse(currentUser).username,
    };
    await this.roleRepository.save(newData);
    return ResultData.ok(newData, '操作成功');
  }

  /**
   * 分页
   */
  public async getPage(dto: GetPageDto): Promise<ResultData> {
    const params: GetPageDto = {
      ...dto,
      pageNo: dto.pageNo ? +dto.pageNo : 1,
      pageSize: dto.pageSize ? +dto.pageSize : 15,
    };
    const where = {
      deleted: +params.status === 2 ? 1 : 0,
      status: +params.status === 2 ? undefined : params.status,
      name: params.name,
      type: params.type,
    };
    const result: [Role[], number] = await this.queryCount({
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
   * 列表
   */
  public async getList(): Promise<ResultData> {
    const result: [Role[], number] = await this.queryCount({
      where: { status: 0, deleted: 0 },
    });
    return ResultData.ok({
      list: instanceToPlain(result[0]),
      total: result[1],
    });
  }

  /**
   * 详情
   */
  public async getInfo(id: number): Promise<ResultData> {
    const result = await this.findOne({ id: +id });
    return ResultData.ok(result ? instanceToPlain(result) : {});
  }

  public async findOne(opt: any): Promise<Role> {
    let result = await this.roleRepository.findOne({ where: opt });
    result = plainToInstance(
      Role,
      { ...result },
      { enableImplicitConversion: true },
    );
    return result;
  }

  private async queryCount(options: any): Promise<[Role[], number]> {
    const repositoryOptions: FindManyOptions<Role> = {
      order: { update_time: 'DESC' },
      ...options,
    };
    const result: [Role[], number] = await this.roleRepository.findAndCount(
      repositoryOptions,
    );
    const data: Role[] = plainToInstance(Role, result[0], {
      enableImplicitConversion: true,
    });
    return [data, result[1]];
  }
}
