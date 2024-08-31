import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MinioProvider } from 'src/infrastructure';
import { FileUploaderController } from './file-uploader.controller';
import { CommandHandlers } from './commands/handlers';
import { KafkaProducerService } from 'src/infrastructure/message-broker/kaffka.producer';
import { UploaderMetadataStoreRepository } from './repository/uploader-metadata-store.repository';
import { UploaderObjectStoreRepository } from './repository/uploader-object-store.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FileMetadataEntity,
  FileMetadataEntitySchema,
} from './models/file-metadata.entity';
import { FileUploaderSaga } from './sagas/file-uploader.saga';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: FileMetadataEntity.name, schema: FileMetadataEntitySchema },
    ]),
  ],
  controllers: [FileUploaderController],
  providers: [
    ...CommandHandlers,

    // providers
    MinioProvider,

    // Service
    KafkaProducerService,
    FileUploaderSaga,

    // Repo
    UploaderMetadataStoreRepository,
    UploaderObjectStoreRepository,
  ],
})
export class FileUploaderModule {}
