/*
 * @Author: ZhengJie
 * @Date: 2025-01-11 20:20:15
 * @LastEditTime: 2025-01-18 16:50:05
 * @Description: corp.module
 */
import { Module } from '@nestjs/common';
import { CorpService } from './corp.service';
import { CorpController } from './corp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Corp } from './entities/corp.entity';
import { AuthModule } from '../auth/auth.module';

const EntityFeatures = TypeOrmModule.forFeature([Corp]);

@Module({
  imports: [EntityFeatures, AuthModule],
  controllers: [CorpController],
  providers: [CorpService],
  exports: [CorpService],
})
export class CorpModule {}
