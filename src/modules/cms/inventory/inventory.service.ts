/*
 * @Author: ZhengJie
 * @Date: 2025-03-02 02:32:36
 * @LastEditTime: 2025-03-02 04:16:58
 * @Description: invertory.service
 */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { CatchErrors } from 'src/common/decorators/catch-error.decorator';
import { CommonQueryRepository } from 'src/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/modules/sys/auth/auth.service';
import { CacheService } from 'src/modules/cache/cache.service';
import { ResultData } from 'src/utils/result';
import { instanceToPlain } from 'class-transformer';
import * as moment from 'moment';

@Injectable()
export class InventoryService {
  private readonly queryRepository: CommonQueryRepository;
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
  ) {
    this.queryRepository = new CommonQueryRepository(inventoryRepository);
  }

  /**
   * 创建
   */
  @CatchErrors()
  public async create(createInventoryDto: CreateInventoryDto) {
    const result: Inventory = await this.queryRepository.queryOne(
      {
        goodsId: createInventoryDto.goodsId,
        warehouseId: createInventoryDto.warehouseId,
      },
      Inventory,
    );
    if (Object.keys(result).length > 0) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `${createInventoryDto.goodsId}已存在，请检查商品id`,
      );
    }
    const newData = {
      ...createInventoryDto,
      createBy: 'system',
      createDate: new Date(),
      updateBy: 'system',
      updateDate: new Date(),
    };
    await this.inventoryRepository.save(newData);
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
   * 更新
   */
  @CatchErrors()
  public async update(
    updateInventoryDto: UpdateInventoryDto,
    authorization: string,
  ) {
    if (!updateInventoryDto.goodsId) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查id',
      );
    }
    const result: Inventory = await this.queryRepository.queryOne(
      {
        goodsId: updateInventoryDto.goodsId,
        warehouseId: updateInventoryDto.warehouseId,
      },
      Inventory,
    );
    if (!result) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `未查询到${updateInventoryDto.goodsId}，请检查商品id`,
      );
    }
    const resultPlain = instanceToPlain(result);
    if (resultPlain.status !== '0') {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `该条数据为非可用状态`,
      );
    }
    const { data: tokenData } = await this.authService.validToken(
      authorization,
    );
    const currentUser = await this.cacheService.get(
      `user_${tokenData.id}_${tokenData.userName}`,
    );
    const newData = {
      ...updateInventoryDto,
      updateBy: JSON.parse(currentUser).userCode || 'system',
      updateDate: new Date(),
    };
    await this.inventoryRepository.update(
      { goodsId: updateInventoryDto.goodsId },
      { ...newData },
    );
    return ResultData.ok(
      {
        ...newData,
        createDate: moment(result.createDate).format('YYYY-MM-DD HH:mm:ss'),
        updateDate: moment(newData.updateDate).format('YYYY-MM-DD HH:mm:ss'),
      },
      '操作成功',
    );
  }

  /**
   * 更新
   */
  @CatchErrors()
  public async addNum(
    updateInventoryDto: UpdateInventoryDto,
    authorization: string,
  ) {
    if (!updateInventoryDto.goodsId) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        '请检查id',
      );
    }
    const result: Inventory = await this.queryRepository.queryOne(
      {
        goodsId: updateInventoryDto.goodsId,
        warehouseId: updateInventoryDto.warehouseId,
      },
      Inventory,
    );
    if (!result) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `未查询到${updateInventoryDto.goodsId}，请检查商品id`,
      );
    }
    const resultPlain = instanceToPlain(result);
    const { data: tokenData } = await this.authService.validToken(
      authorization,
    );
    const currentUser = await this.cacheService.get(
      `user_${tokenData.id}_${tokenData.userName}`,
    );
    const newData = {
      ...updateInventoryDto,
      inventoryNumber:
        resultPlain.inventoryNumber + updateInventoryDto.inventoryNumber,
      updateBy: JSON.parse(currentUser).userCode || 'system',
      updateDate: new Date(),
    };
    await this.inventoryRepository.update(
      { goodsId: updateInventoryDto.goodsId },
      { ...newData },
    );
    return ResultData.ok(
      {
        ...newData,
        inventoryNumber: newData.inventoryNumber,
        createDate: moment(result.createDate).format('YYYY-MM-DD HH:mm:ss'),
        updateDate: moment(newData.updateDate).format('YYYY-MM-DD HH:mm:ss'),
      },
      '操作成功',
    );
  }

  /**
   * 查询库存
   */
  @CatchErrors()
  public async getGoodInventory(query: { goodsId: string }) {
    const result: Inventory = await this.queryRepository.queryOne(
      { goodsId: query.goodsId },
      Inventory,
    );
    if (!result) {
      return ResultData.ok({}, '操作成功');
    }
    const resultPlain = instanceToPlain(result);
    return ResultData.ok(resultPlain, '操作成功');
  }
}
