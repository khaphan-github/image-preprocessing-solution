// minio.controller.ts
import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from './minio.service';
import { Response } from 'express';

@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const bucketName = 'my-bucket';
    const fileName = file.originalname;
    const fileBuffer = file.buffer;
    const contentType = file.mimetype;

    await this.minioService.uploadFile(
      bucketName,
      fileName,
      fileBuffer,
      contentType, 
    );
    return { message: 'File uploaded successfully!', fileName };
  }

  @Get('file/:fileName')
  async getFile(@Param('fileName') fileName: string, @Res() res: Response) {
    const bucketName = 'my-bucket';

    const file = await this.minioService.getFile(bucketName, fileName);
    file.getStream().pipe(res);
  }
}
