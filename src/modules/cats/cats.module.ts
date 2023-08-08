/*
 * @Author: ZhengJie
 * @Date: 2023-07-27 22:49:53
 * @Description: cats.module
 */
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsEntity } from './cats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CatsEntity])],
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
