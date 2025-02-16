/*
 * @Author: ZhengJie
 * @Date: 2025-02-14 01:24:05
 * @LastEditTime: 2025-02-16 16:33:30
 * @Description: service.folder
 */
import { Injectable } from '@nestjs/common';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { CommonQueryRepository, snowflakeID } from 'src/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { FileFolder } from './entities/folder.entity';
import { In, Like, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { CacheService } from 'src/modules/cache/cache.service';
import { CatchErrors } from 'src/common/decorators/catch-error.decorator';
import { ResultData } from 'src/utils/result';
import * as moment from 'moment';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class FolderService {
  private readonly queryRepository: CommonQueryRepository;

  constructor(
    @InjectRepository(FileFolder)
    private readonly folderRepository: Repository<FileFolder>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
  ) {
    this.queryRepository = new CommonQueryRepository(folderRepository);
  }

  /**
   * 新增
   */
  @CatchErrors()
  public async create(
    createFolderDto: CreateFolderDto,
    authorization: string,
  ): Promise<ResultData> {
    const where = {
      status: In(['0', '2']),
      folderName:
        createFolderDto.folderName && Like(`%${createFolderDto.folderName}%`),
    };
    const [getFindList] = await this.queryRepository.queryCount(
      {
        where,
      },
      FileFolder,
    );

    // TODO 需要排除不同文件夹下同名的文件
    if (getFindList.some((item) => item.status === '0')) {
      return ResultData.fail(
        this.configService.get('errorCode.valid'),
        `已存在名称${createFolderDto.folderName}`,
      );
    }

    const { data: userData } = await this.authService.getInfo(authorization);

    const newData = {
      ...createFolderDto,
      status: createFolderDto.status || '0',
      id: snowflakeID.NextId() + '',
      createBy: userData.info.username || 'system',
      createDate: new Date(),
      updateBy: userData.info.username || 'system',
      updateDate: new Date(),
    };
    await this.folderRepository.save(newData);
    return ResultData.ok(
      {
        ...newData,
        createDate: moment(newData.createDate).format('YYYY-MM-DD HH:mm:ss'),
        updateDate: moment(newData.updateDate).format('YYYY-MM-DD HH:mm:ss'),
      },
      '操作成功',
    );
  }

  findAll() {
    return `This action returns all folder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} folder`;
  }

  update(id: number, updateFolderDto: UpdateFolderDto) {
    return `This action updates a #${id} folder`;
  }

  remove(id: number) {
    return `This action removes a #${id} folder`;
  }

  /**
   * 列表
   */
  @CatchErrors()
  public async getList(): Promise<ResultData> {
    const result: [FileFolder[], number] =
      await this.queryRepository.queryCount(
        {
          where: { status: In(['0', '2']) },
        },
        FileFolder,
      );
    return ResultData.ok({
      list: instanceToPlain(result[0]),
      total: result[1],
    });
  }

  /**
   * 列表
   */
  @CatchErrors()
  public async getTreeData(): Promise<ResultData> {
    const result: [FileFolder[], number] =
      await this.queryRepository.queryCount(
        {
          where: { status: In(['0', '2']) },
        },
        FileFolder,
      );
    return ResultData.ok(instanceToPlain(result[0]));
  }

  /**
   * 详情
   */
  @CatchErrors()
  public async getInfo(folderId: string): Promise<ResultData> {
    if (!folderId) {
      return ResultData.ok({});
    }
    const result = await this.queryRepository.queryOne(
      { id: folderId },
      FileFolder,
    );
    return ResultData.ok(result ? instanceToPlain(result) : {});
  }
}
