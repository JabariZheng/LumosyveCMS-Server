/*
 * @Author: ZhengJie
 * @Date: 2023-08-11 15:29:33
 * @Description: 租户管理service
 */
import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { TenantPageDto } from './dto/common-tenant.dto';
import { ResultData } from 'src/utils/result';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { CacheService } from 'src/modules/cache/cache.service';
import { formatDate, snowflakeID } from 'src/utils';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * 租户分页
   */
  public async getTenantPage(dto: TenantPageDto): Promise<ResultData> {
    const params: TenantPageDto = {
      ...dto,
      pageNo: dto.pageNo ? +dto.pageNo : 1,
      pageSize: dto.pageSize ? +dto.pageSize : 1,
    };
    const where = {
      deleted: params.status === '2' ? '1' : '0',
      status: params.status === '2' ? undefined : params.status,
      username: params.name,
      contact_name: params.contact_name,
      contact_mobile: params.contact_mobile,
    };
    const result = await this.findByOptions({
      where,
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
   * 租户列表
   */
  public async getTanantList() {
    const result = await this.findByOptions({
      where: { status: 0, deleted: 0 },
    });
    return ResultData.ok({
      list: instanceToPlain(result[0]),
      total: result[1],
    });
  }

  /**
   * 查询租户信息
   */
  public async getTenantInfo(id: number): Promise<ResultData> {
    const result = await this.findOne({ id: id });
    return ResultData.ok({ ...result });
  }

  /**
   * 新增租户
   */
  public async create(
    dto: CreateTenantDto,
    authorization: string,
  ): Promise<ResultData> {
    const result = await this.findOne({ name: dto.name });
    if (Object.keys(instanceToPlain(result)).length > 0) {
      if (instanceToPlain(result).deleted === '0') {
        return ResultData.fail(
          this.configService.get('errorCode.valid'),
          `已存在租户${dto.name}`,
        );
      }
    }

    const auUserId = this.authService.validToken(authorization);
    const currentUser = await this.cacheService.get(auUserId);

    // 拼装数据
    const newData: Tenant = {
      ...dto,
      id: snowflakeID.NextId() as number,
      deleted: '0',
      creator: JSON.parse(currentUser).username,
      create_time: formatDate(+new Date()),
      update_time: formatDate(+new Date()),
      updater: JSON.parse(currentUser).username,
      deleted_time: undefined,
    };
    await this.tenantRepository.save(newData);
    return ResultData.ok(newData, '操作成功');
  }

  /**
   * 删除租户
   */
  public async remove(id: number) {
    if (!id) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查id',
      );
    }
    let result = await this.findOne({ id: +id });
    result = instanceToPlain(result) as Tenant;
    result.deleted = '1';
    result.deleted_time = formatDate(+new Date());
    await this.tenantRepository.save(result);
    return ResultData.ok(result, '操作成功');
  }

  /**
   * 根据条件查询list
   */
  private async findByOptions(opt: any): Promise<[Tenant[], number]> {
    const repositoryOptions: FindManyOptions<Tenant> = {
      order: { update_time: 'DESC' },
      ...opt,
    };
    const result: [Tenant[], number] = await this.tenantRepository.findAndCount(
      repositoryOptions,
    );
    const data: Tenant[] = plainToInstance(Tenant, result[0], {
      enableImplicitConversion: true,
    });
    return [data, result[1]];
  }

  /**
   * 查询一个
   */
  public async findOne(opt: any): Promise<Tenant> {
    let result = await this.tenantRepository.findOne({ where: opt });
    result = plainToInstance(
      Tenant,
      { ...result },
      {
        enableImplicitConversion: true,
      },
    );
    return result;
  }

  findAll() {
    return `This action returns all tenant`;
  }
  /**
   * 更新
   */
  public async update(updateTenantDto: UpdateTenantDto, authorization: string) {
    if (!updateTenantDto.id) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查id',
      );
    }
    const result = await this.findOne({ id: +updateTenantDto.id });
    if (!result) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `未查询到${updateTenantDto.id}，请检查id`,
      );
    }
    const auUserId = this.authService.validToken(authorization);
    const currentUser = await this.cacheService.get(auUserId);
    const newData = {
      ...instanceToPlain(result),
      ...updateTenantDto,
      id: +updateTenantDto.id,
      update_time: formatDate(+new Date()),
      updater: JSON.parse(currentUser).username,
    };
    await this.tenantRepository.save(newData);
    return ResultData.ok(newData, '操作成功');
  }
}
