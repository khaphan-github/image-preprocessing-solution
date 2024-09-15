import { Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './infrastructure/persistent/minio/env.validation';
import { FileUploaderModule } from './modules/file-uploader/file-uploader.module';
import { KafkaProducerService } from './infrastructure/message-broker/kaffka.producer';
import { envKafkaValidationSchema } from './infrastructure/message-broker/env.validation';
import { MongoDbModuleProvider } from './infrastructure/persistent/mongodb/module.provider';
import { envMongoDbValidationSchema } from './infrastructure/persistent/mongodb/env.validation';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        ...envValidationSchema.describe().children,
        ...envKafkaValidationSchema.describe().children,
        ...envMongoDbValidationSchema.describe().children,
      }),
    }),
    MongoDbModuleProvider,
    FileUploaderModule,
  ],
  controllers: [AppController],
  providers: [AppService, KafkaProducerService],
})
export class AppModule implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppModule.name);
  constructor(private readonly kafkaProducerService: KafkaProducerService) {}
  async onApplicationBootstrap() {
    this.logger.log(`App initialized`);
    await this.kafkaProducerService.connectToKafka();
  }
}
