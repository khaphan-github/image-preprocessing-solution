// minio.module.ts
import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: 'MINIO_CONNECTION',
      useFactory: (configService: ConfigService) => {
        const Minio = require('minio');
        return new Minio.Client({
          endPoint: configService.get<string>('MINIO_ENDPOINT'),
          port: parseInt(configService.get<string>('MINIO_PORT')),
          useSSL: configService.get<boolean>('MINIO_USE_SSL'),
          accessKey: configService.get<string>('MINIO_ACCESS_KEY'),
          secretKey: configService.get<string>('MINIO_SECRET_KEY'),
        });
      },
      inject: [ConfigService],
    },
    MinioService,
  ],
  exports: [MinioService],
})
export class MinioModule {}
