import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MinioProvider, MongoDBProvider } from 'src/infrastructure';
import { FileUploaderController } from './file-uploader.controller';
import { CommandHandlers } from './commands/handlers';
import { KafkaProducerService } from 'src/infrastructure/message-broker/kaffka.producer';

@Module({
  imports: [CqrsModule],
  controllers: [FileUploaderController],
  providers: [
    ...CommandHandlers,
    MinioProvider,
    MongoDBProvider,
    KafkaProducerService,
  ],
})
export class FileUploaderModule {}
