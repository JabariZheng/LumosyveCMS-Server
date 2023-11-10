/*
 * @Author: ZhengJie
 * @Date: 2023-09-17 23:34:13
 * @Description: dictData.service
 */
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateDictDatumDto } from './dto/create-dict-datum.dto';
import { UpdateDictDatumDto } from './dto/update-dict-datum.dto';
import { GetPageDto } from './dto/index.dto';
import { ResultData } from 'src/utils/result';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { DictDatum } from './entities/dict-datum.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { CacheService } from 'src/modules/cache/cache.service';
import { snowflakeID } from 'src/utils';
import { DictService } from '../dict/dict.service';

@Injectable()
export class DictDataService {
  constructor(
    @InjectRepository(DictDatum)
    private readonly dictDataRepository: Repository<DictDatum>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
    @Inject(forwardRef(() => DictService))
    private readonly dictService: DictService,
  ) {}

  /**
   * 新增
   */
  public async add(
    createDictDatumDto: CreateDictDatumDto,
    authorization: string,
  ) {
    const getFind = await this.findOne({
      label: createDictDatumDto.label,
      value: createDictDatumDto.value,
    });
    // 需要label、value同时唯一并且排除已删除状态的数据
    if (
      Object.keys(instanceToPlain(getFind)).length > 0 &&
      instanceToPlain(getFind).deleted === '0'
    ) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `已存在${createDictDatumDto.label}`,
      );
    }
    // 查询是否存在dict-type
    const getDictTypeResult = await this.dictService.findOne({
      type: createDictDatumDto.dictType,
    });
    if (Object.keys(instanceToPlain(getDictTypeResult)).length === 0) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `不存在字典类型${createDictDatumDto.dictType}`,
      );
    }
    const auUserId = this.authService.validToken(authorization);
    const currentUser = await this.cacheService.get(auUserId);
    const newData: DictDatum = {
      status: 0,
      ...createDictDatumDto,
      id: snowflakeID.NextId() as number,
      deleted: 0,
      creator: JSON.parse(currentUser).username,
      createTime: new Date(),
      updateTime: new Date(),
      updater: JSON.parse(currentUser).username,
      deletedTime: undefined,
    };
    await this.dictDataRepository.save(newData);
    return ResultData.ok(newData, '操作成功');
  }

  /**
   * 删除
   */
  public async remove(id: number, authorization: string) {
    if (!id) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查id',
      );
    }
    let result = await this.findOne({ id: +id });
    result = instanceToPlain(result) as DictDatum;
    result.deleted = 1;
    result.deletedTime = new Date();
    const auUserId = this.authService.validToken(authorization);
    const currentUser = await this.cacheService.get(auUserId);
    result.updater = JSON.parse(currentUser).username;
    await this.dictDataRepository.save(result);
    return ResultData.ok(result, '操作成功');
  }

  /**
   * 删除
   */
  public async removeByDictType(dictType: string, authorization: string) {
    if (!dictType) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查dictType',
      );
    }
    const auUserId = this.authService.validToken(authorization);
    const currentUser = await this.cacheService.get(auUserId);
    let result = await this.findOne({ dictType: dictType });
    result = instanceToPlain(result) as DictDatum;
    result = {
      ...result,
      deleted: 1,
      deletedTime: new Date(),
      updateTime: new Date(),
      updater: JSON.parse(currentUser).username,
    };
    await this.dictDataRepository.save(result);
    return ResultData.ok(result, '操作成功');
  }

  /**
   * 更新
   */
  async update(updateDictDatumDto: UpdateDictDatumDto, authorization: string) {
    if (!updateDictDatumDto.id) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查id',
      );
    }
    const result = await this.findOne({ id: +updateDictDatumDto.id });
    if (!result) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `未查询到${updateDictDatumDto.id}，请检查id`,
      );
    }
    const auUserId = this.authService.validToken(authorization);
    const currentUser = await this.cacheService.get(auUserId);
    const newData = {
      ...instanceToPlain(result),
      ...updateDictDatumDto,
      id: +updateDictDatumDto.id,
      update_time: new Date(),
      updater: JSON.parse(currentUser).username,
    };
    await this.dictDataRepository.save(newData);
    return ResultData.ok(newData, '操作成功');
  }

  /**
   * 分页
   */
  async getPage(dto: GetPageDto): Promise<ResultData> {
    const params: GetPageDto = {
      ...dto,
      pageNo: dto.pageNo ? +dto.pageNo : 1,
      pageSize: dto.pageSize ? +dto.pageSize : 15,
    };
    const where = {
      deleted: 0,
      status: params.status && +params.status,
      name: params.name,
      dictType: params.type,
    };
    const result: [DictDatum[], number] = await this.queryCount({
      where,
      order: { updateTime: 'DESC' },
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
  async getList(): Promise<ResultData> {
    const result: [DictDatum[], number] = await this.queryCount({
      where: { status: 0, deleted: 0 },
    });
    return ResultData.ok({
      list: instanceToPlain(result[0]),
      total: result[1],
    });
  }

  async getListByType(type: string): Promise<ResultData> {
    const result: [DictDatum[], number] = await this.queryCount({
      where: { status: 0, deleted: 0, dictType: type },
    });
    // return ResultData.ok({
    //   list: instanceToPlain(result[0]),
    //   total: result[1],
    // });
    return ResultData.ok(instanceToPlain(result[0]));
  }

  /**
   * 详情
   */
  public async getInfo(id: number): Promise<ResultData> {
    const result = await this.findOne({ id: +id });
    return ResultData.ok(result ? instanceToPlain(result) : {});
  }

  public async findOne(opt: any): Promise<DictDatum> {
    let result = await this.dictDataRepository.findOne({ where: opt });
    result = plainToInstance(
      DictDatum,
      { ...result },
      { enableImplicitConversion: true },
    );
    return result;
  }

  public async queryCount(options: any): Promise<[DictDatum[], number]> {
    const repositoryOptions: FindManyOptions<DictDatum> = {
      order: { updateTime: 'DESC' },
      ...options,
    };
    const result: [DictDatum[], number] =
      await this.dictDataRepository.findAndCount(repositoryOptions);
    const data: DictDatum[] = plainToInstance(DictDatum, result[0], {
      enableImplicitConversion: true,
    });
    return [data, result[1]];
  }
}
