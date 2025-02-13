/*
 * @Author: ZhengJie
 * @Date: 2023-10-28 22:03:56
 * @Description: 图片上传
 */
import { Module } from '@nestjs/common';
import { UploadImagesService } from './upload-images.service';
import { UploadImagesController } from './upload-images.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const MulterFactory = MulterModule.registerAsync({
  useFactory() {
    return {
      storage: diskStorage({
        // 文件位置（固定形式）
        // destination: 'public/uploads/images',
        // 动态写法
        destination: (_req, _file, callback) => {
          console.log(process.cwd());
          // TODO 设置文件名，暂时使用“common”
          const targetDir = join(process.cwd(), 'public', 'uploads', 'common');
          if (!existsSync(targetDir)) {
            mkdirSync(targetDir, {
              recursive: true,
            });
          }

          callback(null, targetDir);
          // callback(null, 'public/uploads/images');
        },
        filename: (req, file, callback) => {
          const path = `${Date.now()}-${Math.round(
            Math.random() * 1e10,
          )}${extname(file.originalname)}`;
          callback(null, path);
        },
      }),
    };
  },
});

@Module({
  imports: [MulterFactory],
  controllers: [UploadImagesController],
  providers: [UploadImagesService],
})
export class UploadImagesModule {}
