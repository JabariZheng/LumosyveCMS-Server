/*
 * @Author: ZhengJie
 * @Date: 2023-10-28 22:03:56
 * @Description: uploadImages.controller
 */
import { Controller, Post, UploadedFile, UploadedFiles } from '@nestjs/common';
import { UploadImagesService } from './upload-images.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  UploadImg,
  UploadImgs,
} from 'src/common/decorators/upload-img.decorator';
import { ResultData } from 'src/utils/result';
import { CatchErrors } from 'src/common/decorators/catch-error.decorator';

@ApiTags('图片上传')
@Controller('/sys/upload-images')
export class UploadImagesController {
  constructor(private readonly uploadImagesService: UploadImagesService) {}

  @Post('')
  @UploadImgs()
  @ApiOperation({ summary: '上传图片多个' })
  @CatchErrors()
  uploadImages(@UploadedFiles() files: { files: Express.Multer.File[] }) {
    const { host, port } = this.uploadImagesService.getAppServer();
    const result = files.files.map((file) => {
      return {
        name: file.filename,
        size: file.size,
        url: `http://${host}:${port}/${file.path}`,
      };
    });
    return ResultData.ok(result);
  }

  @Post('item')
  @UploadImg()
  @ApiOperation({ summary: '上传图片单个' })
  @CatchErrors()
  uploadImageItem(@UploadedFile() file: Express.Multer.File) {
    const { host, port } = this.uploadImagesService.getAppServer();
    return ResultData.ok({
      name: file.filename,
      size: file.size,
      url: `http://${host}:${port}/${file.path}`,
    });
  }
}
