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
import { Repository } from 'typeorm';
import { CacheService } from 'src/modules/cache/cache.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private cacheService: CacheService,
  ) {}

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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
