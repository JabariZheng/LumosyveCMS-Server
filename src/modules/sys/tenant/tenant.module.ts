/*
 * @Author: ZhengJie
 * @Date: 2023-08-11 15:29:33
 * @Description: 租户
 */
import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';

const EntityFeatures = TypeOrmModule.forFeature([Tenant]);
@Module({
  imports: [EntityFeatures],
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}
