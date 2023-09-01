/*
 * @Author: ZhengJie
 * @Date: 2023-07-27 22:23:42
 * @Description: app.module
 */
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
// import { LoggerMiddleware } from './middleware/log.middleware';
import { LoginMiddleware } from './middleware/login.middleware';
import { UserModule } from './modules/sys/user/user.module';
import { CacheModule } from './modules/cache/cache.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

import configuration from './config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './modules/sys/auth/auth.module';
import { TenantModule } from './modules/sys/tenant/tenant.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/auth.guard';
import { ViewsModule } from './modules/sys/views/views.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      cache: true,
      load: [configuration],
      isGlobal: true,
    }),
    // mysql
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          // logger: false,
          autoLoadEntities: true,
          ...config.get('db.mysql'),
        } as TypeOrmModuleOptions;
      },
    }),
    // redisCahce
    CacheModule,
    // 常规模块
    AuthModule,
    UserModule,
    TenantModule,
    ViewsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // .apply(LoggerMiddleware, LoginMiddleware)
    consumer
      .apply(LoginMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
