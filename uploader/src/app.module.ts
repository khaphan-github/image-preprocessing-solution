import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MinioController } from './infrastructure/minio/minio.controller';
import { MinioModule } from './infrastructure/minio/minio.module';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './infrastructure/minio/env.validation';
import { MongoDBProvider } from './infrastructure/mongodb/mongodb.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule globally available
      envFilePath: '.env', // Path to your environment file,
      validationSchema: envValidationSchema,
    }),
    MinioModule,
  ],
  controllers: [AppController, MinioController],
  providers: [AppService, MongoDBProvider],
})
export class AppModule {}
