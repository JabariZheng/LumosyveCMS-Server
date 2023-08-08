/*
 * @Author: ZhengJie
 * @Date: 2023-07-27 22:23:42
 * @Description: main
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './pipe/validation.pipe';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app: any = await NestFactory.create(AppModule, {
    cors: true,
  });

  const configService = app.get(ConfigService<any>);
  // 设置api访问前缀
  app.setGlobalPrefix(configService.get('app').prefix);
  // 设置校验pipe
  app.useGlobalPipes(new ValidationPipe());

  // 设置swagger
  // 装饰器列表：https://beta.midwayjs.org/docs/extensions/swagger/#%E8%A3%85%E9%A5%B0%E5%99%A8%E5%88%97%E8%A1%A8

  await app.listen(configService.get('app').port);
}

bootstrap();
