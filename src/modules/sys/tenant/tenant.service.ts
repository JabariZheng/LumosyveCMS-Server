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

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly configService: ConfigService,
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
      status: params.status || 0,
      username: params.name,
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
    const result = await this.findByOptions({ where: { status: 0 } });
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
  public async create(dto: CreateTenantDto): Promise<ResultData> {
    const errorValidCode = this.configService.get<string>('errorCode.valid');
    const getFind = await this.findOne({ name: dto.name });
    if (Object.keys(getFind || {}).length > 0) {
      return ResultData.fail(+errorValidCode, `已存在租户${dto.name}`);
    }
    // 拼装数据
    const newTenant: CreateTenantDto = {
      ...dto,
      // TODO 从登录缓存里取
      creator: 'jabari',
      deleted: 0,
    };
    return ResultData.ok({ data: dto });
  }

  /**
   * 删除租户
   */

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
    result = plainToInstance(Tenant, result, {
      enableImplicitConversion: true,
    });
    return result;
  }

  findAll() {
    return `This action returns all tenant`;
  }

  update(id: number, updateTenantDto: UpdateTenantDto) {
    return `This action updates a #${id} tenant`;
  }

  remove(id: number) {
    return `This action removes a #${id} tenant`;
  }
}
