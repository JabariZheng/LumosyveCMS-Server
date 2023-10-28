/*
 * @Author: ZhengJie
 * @Date: 2023-10-28 22:03:56
 * @Description: uploadImages.controller
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { UploadImagesService } from './upload-images.service';
import { CreateUploadImageDto } from './dto/create-upload-image.dto';
import { UpdateUploadImageDto } from './dto/update-upload-image.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  UploadImg,
  UploadImgs,
} from 'src/common/decorators/upload-img.decorator';
import { ResultData } from 'src/utils/result';

@ApiTags('图片上传')
@Controller('/sys/upload-images')
export class UploadImagesController {
  constructor(private readonly uploadImagesService: UploadImagesService) {}

  @Post('')
  @UploadImgs()
  @ApiOperation({ summary: '上传图片多个' })
  uploadImages(@UploadedFiles() files: { file: Express.Multer.File[] }) {
    const { host, port } = this.uploadImagesService.getAppServer();
    const result = files.file.map((file) => {
      return {
        url: `http://${host}:${port}/${file.path}`,
      };
    });
    return ResultData.ok(result);
  }

  @Post('item')
  @UploadImg()
  @ApiOperation({ summary: '上传图片单个' })
  uploadImageItem(@UploadedFile() file: Express.Multer.File) {
    const { host, port } = this.uploadImagesService.getAppServer();
    return ResultData.ok({
      url: `http://${host}:${port}/${file.path}`,
    });
  }
}
