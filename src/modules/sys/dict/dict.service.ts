/*
 * @Author: ZhengJie
 * @Date: 2023-09-02 18:19:30
 * @Description: dict.service
 */
import { Injectable } from '@nestjs/common';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { GetPageDto } from './dto/index.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dict } from './entities/dict.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ResultData } from 'src/utils/result';
import { ConfigService } from '@nestjs/config';
import { snowflakeID } from 'src/utils';
import { AuthService } from '../auth/auth.service';
import { CacheService } from 'src/modules/cache/cache.service';
import { DictDatum } from '../dict-data/entities/dict-datum.entity';

@Injectable()
export class DictService {
  constructor(
    @InjectRepository(Dict)
    private readonly dictRepository: Repository<Dict>,
    @InjectRepository(DictDatum)
    private readonly dictDataRepository: Repository<DictDatum>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * 新增
   */
  public async create(
    createDictDto: CreateDictDto,
    authorization: string,
  ): Promise<ResultData> {
    const result = await this.findOne({ name: createDictDto.name });
    if (
      Object.keys(instanceToPlain(result)).length > 0 &&
      instanceToPlain(result).deleted === '0'
    ) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `已存在${createDictDto.name}`,
      );
    }

    const auUserId = this.authService.validToken(authorization);
    const currentUser = await this.cacheService.get(auUserId);
    const newData: Dict = {
      status: 0,
      ...createDictDto,
      id: snowflakeID.NextId() as number,
      deleted: 0,
      creator: JSON.parse(currentUser).username,
      createTime: new Date(),
      updateTime: new Date(),
      updater: JSON.parse(currentUser).username,
      deletedTime: undefined,
    };
    await this.dictRepository.save(newData);
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
    // 字典类型删除
    let result = await this.findOne({ id: +id });
    result = instanceToPlain(result) as Dict;
    result.deleted = 1;
    result.deletedTime = new Date();
    // 字典数据删除
    let dictDataResult = await this.dictDataRepository.find({
      where: { dict_type: result.type },
    });
    dictDataResult = instanceToPlain(dictDataResult) as DictDatum[];
    dictDataResult = dictDataResult.map((item: DictDatum) => {
      item.deleted = '1';
      item.deleted_time = new Date();
      return item;
    });
    await this.dictRepository.save(result);
    await this.dictDataRepository.save(dictDataResult);
    return ResultData.ok(result, '操作成功');
  }


  /**
   * 更新
   */
  public async update(updateDictDto: UpdateDictDto, authorization: string) {
    if (!updateDictDto.id) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查id',
      );
    }
    const result = await this.findOne({ id: +updateDictDto.id });
    if (!result) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `未查询到${updateDictDto.id}，请检查id`,
      );
    }
    const auUserId = this.authService.validToken(authorization);
    const currentUser = await this.cacheService.get(auUserId);
    const newData = {
      ...instanceToPlain(result),
      ...updateDictDto,
      id: +updateDictDto.id,
      updateTime: new Date(),
      updater: JSON.parse(currentUser).username,
    };
    await this.dictRepository.save(newData);
    return ResultData.ok(newData, '操作成功');
  }

  /**
   * 分页
   */
  public async getPage(dto: GetPageDto): Promise<ResultData> {
    const params: GetPageDto = {
      ...dto,
      status: dto.status || 0,
      pageNo: dto.pageNo ? +dto.pageNo : 1,
      pageSize: dto.pageSize ? +dto.pageSize : 15,
    };
    const where = {
      deleted: +params.status === 2 ? 1 : 0,
      status: +params.status === 2 ? undefined : params.status,
      name: params.name,
      type: params.type,
    };
    console.log('where', where);

    const result: [Dict[], number] = await this.queryCount({
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
  public async getList(): Promise<ResultData> {
    const result: [Dict[], number] = await this.queryCount({
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


  findAll() {
    return `This action returns all dict`;
  }

  public async findOne(opt: any): Promise<Dict> {
    let result = await this.dictRepository.findOne({ where: opt });
    result = plainToInstance(
      Dict,
      { ...result },
      { enableImplicitConversion: true },
    );
    return result;
  }

  private async queryCount(options: any): Promise<[Dict[], number]> {
    const repositoryOptions: FindManyOptions<Dict> = {
      order: { update_time: 'DESC' },
      ...options,
    };
    const result: [Dict[], number] = await this.dictRepository.findAndCount(
      repositoryOptions,
    );
    const data: Dict[] = plainToInstance(Dict, result[0], {
      enableImplicitConversion: true,
    });
    return [data, result[1]];
  }
}
