/*
 * @Author: ZhengJie
 * @Date: 2023-09-02 18:19:30
 * @Description: dict.service
 */
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { DelActionByIdsDot, GetPageDto } from './dto/index.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dict } from './entities/dict.entity';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ResultData } from 'src/utils/result';
import { ConfigService } from '@nestjs/config';
import { snowflakeID } from 'src/utils';
import { AuthService } from '../auth/auth.service';
import { CacheService } from 'src/modules/cache/cache.service';
import { DictDataService } from '../dict-data/dict-data.service';
import { CatchErrors } from 'src/common/decorators/catch-error.decorator';
import {
  FormatDefaultPagination,
  FormatEmptyParams,
} from 'src/common/decorators/format-dto.decorator';
import * as moment from 'moment';

@Injectable()
export class DictService {
  constructor(
    @InjectRepository(Dict)
    private readonly dictRepository: Repository<Dict>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
    @Inject(forwardRef(() => DictDataService))
    private readonly dictDataService: DictDataService,
  ) {}

  /**
   * 新增
   */
  @CatchErrors()
  public async create(
    createDictDto: CreateDictDto,
    authorization: string,
  ): Promise<ResultData> {
    // // 需要name、type同时唯一并且排除已删除状态的数据
    // const getFingName = await this.findOne({
    //   name: createDictDto.name,
    // });
    // const hasFindName = instanceToPlain(getFingName);
    // if (
    //   Object.keys(hasFindName).length > 0 &&
    //   +instanceToPlain(hasFindName).status === 1
    // ) {
    //   return ResultData.fail(
    //     this.configService.get('errorCode.valid'),
    //     `已存在名称${createDictDto.name}`,
    //   );
    // }
    // const getFindType = await this.findOne({
    //   type: createDictDto.type,
    // });
    // const hasFindType = instanceToPlain(getFindType);
    // if (
    //   Object.keys(hasFindType).length > 0 &&
    //   +instanceToPlain(hasFindType).status === 1
    // ) {
    //   return ResultData.fail(
    //     this.configService.get('errorCode.valid'),
    //     `已存在类型${createDictDto.type}`,
    //   );
    // }
    // const auUserId = await this.authService.validToken(authorization);
    // const currentUser = await this.cacheService.get(`user_${auUserId}`);
    const newData = {
      ...createDictDto,
      status: createDictDto.status || '0',
      id: snowflakeID.NextId() + '',
      createBy: 'system',
      // createBy: JSON.parse(currentUser).username || 'system',
      createDate: new Date(),
      // updateBy: JSON.parse(currentUser).username || 'system',
      updateBy: 'system',
      updateDate: new Date(),
    };
    await this.dictRepository.save(newData);
    return ResultData.ok(
      {
        ...newData,
        createDate: moment(newData.createDate).format('YYYY-MM-DD HH:mm:ss'),
        updateDate: moment(newData.updateDate).format('YYYY-MM-DD HH:mm:ss'),
      },
      '操作成功',
    );
  }

  /**
   * 删除
   */
  @CatchErrors()
  public async remove(opt: DelActionByIdsDot, authorization: string) {
    const { ids, status } = opt;
    if (!ids || ids.length === 0) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查ids',
      );
    }
    // const auUserId = this.authService.validToken(authorization);
    // const currentUser = await this.cacheService.get(`user_${auUserId}`);

    await this.dictRepository
      .createQueryBuilder()
      .update(Dict)
      .set({
        status: status || '1',
        updateDate: new Date(),
        updateBy: 'system',
      })
      .whereInIds(ids)
      .execute();

    // 字典类型删除
    // let result: Dict = await this.findOne({ id: +id });
    // result = instanceToPlain(result) as Dict;
    // result = {
    //   ...result,
    //   updateDate: new Date(),
    //   updateBy: JSON.parse(currentUser).username,
    // };
    // await this.dictRepository.save(result);
    // 字典数据删除
    // await this.dictDataService.removeByDictType(result.type, authorization);
    // return ResultData.ok(result, '操作成功');
    return ResultData.ok({}, '操作成功');
  }

  /**
   * 更新
   */
  @CatchErrors()
  public async update(updateDictDto: UpdateDictDto, authorization: string) {
    if (!updateDictDto.id) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查id',
      );
    }
    const result = await this.findOne({ id: updateDictDto.id });
    if (!result) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `未查询到${updateDictDto.id}，请检查id`,
      );
    }
    const resultPlain = instanceToPlain(result);
    if (resultPlain.status !== '0') {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `该条数据为非可用状态`,
      );
    }
    // const auUserId = this.authService.validToken(authorization);
    // const currentUser = await this.cacheService.get(`user_${auUserId}`);
    const newData = {
      ...updateDictDto,
      updateDate: new Date(),
      updateBy: 'system',
    };
    await this.dictRepository.update(updateDictDto.id, {
      ...newData,
    });
    return ResultData.ok(newData, '操作成功');
  }

  /**
   * 分页
   */
  @CatchErrors()
  @FormatDefaultPagination()
  @FormatEmptyParams()
  public async getPage(dto: GetPageDto): Promise<ResultData> {
    const where = {
      status: dto.status,
      dictName: dto.dictName && Like(`%${dto.dictName}%`),
      dictType: dto.dictType && Like(`%${dto.dictType}%`),
    };
    const result: [Dict[], number] = await this.queryCount({
      where,
      order: { updateDate: 'DESC' },
      skip: (dto.pageNo - 1) * dto.pageSize,
      take: dto.pageSize,
    });
    return ResultData.ok({
      list: instanceToPlain(result[0]),
      total: result[1],
      pageNo: dto.pageNo,
      pageSize: dto.pageSize,
    });
  }

  /**
   * 列表
   */
  @CatchErrors()
  public async getList(): Promise<ResultData> {
    const result: [Dict[], number] = await this.queryCount({
      where: { status: '0' },
    });
    return ResultData.ok({
      list: instanceToPlain(result[0]),
      total: result[1],
    });
  }

  /**
   * 详情
   */
  @CatchErrors()
  public async getInfo(id: string): Promise<ResultData> {
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

  public async queryCount(options: any): Promise<[Dict[], number]> {
    const repositoryOptions: FindManyOptions<Dict> = {
      order: { updateDate: 'DESC' },
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
