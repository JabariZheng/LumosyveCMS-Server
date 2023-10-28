/*
 * @Author: ZhengJie
 * @Date: 2023-10-28 22:18:08
 * @Description: 上传图片
 */
import {
  MethodNotAllowedException,
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ResultData } from 'src/utils/result';

export function UploadImg(fieldName = 'file', options?: MulterOptions) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(
        fieldName,
        options || {
          limits: { fileSize: Math.pow(1024, 2) * 2 },
          fileFilter(
            req: any,
            file: Express.Multer.File,
            callback: (error: Error | null, acceptFile: boolean) => void,
          ) {
            console.log('file', file);
            if (!file.mimetype.includes('image')) {
              callback(new MethodNotAllowedException('类型不支持'), false);
            } else {
              callback(null, true);
            }
          },
        },
      ),
    ),
  );
}
export function UploadImgs(uploadFields?, options?: MulterOptions) {
  return applyDecorators(
    UseInterceptors(
      FileFieldsInterceptor(
        uploadFields || [{ name: 'file' }],
        options || {
          limits: { fileSize: Math.pow(1024, 2) * 2 },
          fileFilter(
            req: any,
            file: Express.Multer.File,
            callback: (error: Error | null, acceptFile: boolean) => void,
          ) {
            if (!file.mimetype.includes('image')) {
              callback(new MethodNotAllowedException('类型不支持'), false);
            } else {
              callback(null, true);
            }
          },
        },
      ),
    ),
  );
}
