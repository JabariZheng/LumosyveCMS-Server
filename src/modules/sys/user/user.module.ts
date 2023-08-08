/*
 * @Author: ZhengJie
 * @Date: 2023-08-06 23:49:40
 * @Description: user.module
 */
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
// import { CacheService } from 'src/modules/cache/cache.service';
// import { CacheModule } from 'src/modules/cache/cache.module';

const EntityFeatures = TypeOrmModule.forFeature([User]);

@Module({
  // imports: [EntityFeatures, AuthModule, CacheModule],
  imports: [EntityFeatures, AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
