import { ConfigService } from '@nestjs/config';

export const MINIO_PROVIDER_CONNECTION = 'MINIO_CONNECTION';
export const MinioProvider = {
  provide: MINIO_PROVIDER_CONNECTION,
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
};
