import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './infrastructure/persistent/minio/env.validation';
import { FileUploaderModule } from './modules/file-uploader/file-uploader.module';
import { KafkaProducerService } from './infrastructure/message-broker/kaffka.producer';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule globally available
      envFilePath: '.env', // Path to your environment file,
      validationSchema: envValidationSchema,
    }),
    MongooseModule.forRoot('mongodb://root:root@mongo:27017'),
    FileUploaderModule,
  ],
  controllers: [AppController],
  providers: [AppService, KafkaProducerService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly kafkaProducerService: KafkaProducerService) {}
  onApplicationBootstrap() {
    // setInterval(async () => {
    //   await this.kafkaProducerService
    //     .produceMessage('upload-image-resolution', 'hehe')
    //     .then((res) => {
    //       console.log(res);
    //     });
    // }, 4000);
  }
}
