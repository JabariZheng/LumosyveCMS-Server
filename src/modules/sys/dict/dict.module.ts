/*
 * @Author: ZhengJie
 * @Date: 2023-09-02 18:19:30
 * @Description: module.dict
 */
import { Module } from '@nestjs/common';
import { DictService } from './dict.service';
import { DictController } from './dict.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dict } from './entities/dict.entity';

const EntityFeatures = TypeOrmModule.forFeature([Dict]);

@Module({
  imports: [EntityFeatures],
  controllers: [DictController],
  providers: [DictService],
})
export class DictModule {}
