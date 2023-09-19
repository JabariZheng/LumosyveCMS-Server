/*
 * @Author: ZhengJie
 * @Date: 2023-08-07 15:13:08
 * @Description: 权限管理
 */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '../tenant/entities/tenant.entity';

const JwtModuleImport = JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    secret: config.get('jwt.secretkey'),
    signOptions: {
      expiresIn: config.get('jwt.expiresin'),
    },
  }),
});

const TenantEntityFeatures = TypeOrmModule.forFeature([Tenant]);

@Module({
  imports: [JwtModuleImport, UserModule, TenantEntityFeatures],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
