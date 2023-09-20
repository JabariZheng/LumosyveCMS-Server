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
import { AuthModule } from '../auth/auth.module';
import { DictDatum } from '../dict-data/entities/dict-datum.entity';

const EntityFeatures = TypeOrmModule.forFeature([Dict]);
const DictDataEntityFeatures = TypeOrmModule.forFeature([DictDatum]);

@Module({
  imports: [EntityFeatures, DictDataEntityFeatures, AuthModule],
  controllers: [DictController],
  providers: [DictService],
  exports: [DictService],
})
export class DictModule {}
