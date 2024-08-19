import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MinioController } from './infrastructure/persistent/minio/minio.controller';
import { MinioModule } from './infrastructure/persistent/minio/minio.module';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './infrastructure/persistent/minio/env.validation';
import { MongoDBProvider } from './infrastructure/persistent/mongodb/mongodb.provider';

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
