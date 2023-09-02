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

@Injectable()
export class DictService {
  constructor(
    @InjectRepository(Dict)
    private readonly dictRepository: Repository<Dict>,
  ) {}

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
      status: params.status || 0,
      name: params.name,
      type: params.type,
    };
    const result: [Dict[], number] = await this.queryCount({
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
    const result: [Dict[], number] = await this.queryCount({
      where: { status: 0 },
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

  create(createDictDto: CreateDictDto) {
    return 'This action adds a new dict';
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

  update(id: number, updateDictDto: UpdateDictDto) {
    return `This action updates a #${id} dict`;
  }

  remove(id: number) {
    return `This action removes a #${id} dict`;
  }
}
