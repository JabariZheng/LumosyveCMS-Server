/*
 * @Author: ZhengJie
 * @Date: 2023-07-27 22:23:42
 * @Description: main
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './pipe/validation.pipe';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerMiddleware } from './middleware/log.middleware';
import { Logger } from './common/libs/log4js/log4js';
import { HttpExceptionsFilter } from './common/libs/log4js/http-exceptions-filter';

async function bootstrap() {
  const Chalk = await import('chalk');

  Logger.log(Chalk.green(`Nest-Admin 启动服务 `));
  const app: any = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'warn'],
  });

  const configService = app.get(ConfigService<any>);
  const { prefix, port } = configService.get('app');
  // 设置api访问前缀
  app.setGlobalPrefix(prefix);
  // 全局Log
  app.use(LoggerMiddleware);
  // 设置校验pipe
  app.useGlobalPipes(new ValidationPipe());
  // HTTP异常
  app.useGlobalFilters(new HttpExceptionsFilter());

  // 设置swagger
  // 装饰器列表：https://beta.midwayjs.org/docs/extensions/swagger/#%E8%A3%85%E9%A5%B0%E5%99%A8%E5%88%97%E8%A1%A8
  const swaggerConfig = configService.get('swagger');
  const swaggerOptions = new DocumentBuilder()
    .setTitle(swaggerConfig.title)
    .setDescription(swaggerConfig.description)
    .setVersion(swaggerConfig.version)
    .addBasicAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(`${prefix}/docs`, app, document);

  await app.listen(port);

  Logger.log(
    Chalk.green(`Nest-Admin 服务启动成功 `),
    '\n',
    Chalk.green('服务地址'),
    `                http://localhost:${port}${prefix}/`,
    '\n',
    Chalk.green('swagger 文档地址        '),
    `http://localhost:${port}${prefix}/docs/`,
  );
}

bootstrap();
