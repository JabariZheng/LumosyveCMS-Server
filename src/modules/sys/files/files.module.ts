/*
 * @Author: ZhengJie
 * @Date: 2025-02-14 00:51:39
 * @LastEditTime: 2025-02-14 03:34:54
 * @Description: module.files
 */
import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Files } from './entities/file.entity';
import { AuthModule } from '../auth/auth.module';
import { FolderModule } from '../folder/folder.module';

const EntityFeatures = TypeOrmModule.forFeature([Files]);

@Module({
  imports: [EntityFeatures, AuthModule, FolderModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
