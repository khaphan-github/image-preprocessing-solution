// minio.service.ts
import { Injectable, Inject, StreamableFile } from '@nestjs/common';
import { Readable } from 'stream';

@Injectable()
export class MinioService {
  constructor(@Inject('MINIO_CONNECTION') private readonly minioClient: any) {}

  async uploadFile(
    bucketName: string,
    fileName: string,
    fileBuffer: Buffer,
    contentType: string,
  ): Promise<void> {
    try {
      const bucketExists = await this.minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(bucketName, 'us-east-1');
      }

      await this.minioClient.putObject(bucketName, fileName, fileBuffer, {
        'Content-Type': contentType,
      });
      console.log(`File uploaded successfully to ${bucketName}/${fileName}`);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async getFile(bucketName: string, fileName: string): Promise<StreamableFile> {
    try {
      const fileStream = await this.minioClient.getObject(bucketName, fileName);

      const passThrough = new Readable().wrap(fileStream);
      return new StreamableFile(passThrough);
    } catch (error) {
      console.error('Error retrieving file:', error);
      throw error;
    }
  }
}
