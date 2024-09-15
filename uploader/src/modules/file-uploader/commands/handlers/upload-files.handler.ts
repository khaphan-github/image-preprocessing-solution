import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { UploadFilesCommand } from '../impl/upload-files.command';
import { Inject, NotFoundException } from '@nestjs/common';
import { FileMetadata } from '../../models/file-metadata.model';
import { UploaderObjectStoreRepository } from '../../repository/uploader-object-store.repository';
import { UploaderMetadataStoreRepository } from '../../repository/uploader-metadata-store.repository';
import { mapFileMetadataToDocument } from '../../models/file-metadata.mapper';
import { FileUploadedEvent } from '../../events/file-uploaded.event';

@CommandHandler(UploadFilesCommand)
export class UploadFileCommandHandler
  implements ICommandHandler<UploadFilesCommand>
{
  @Inject()
  private readonly objectStoreRespository: UploaderObjectStoreRepository;
  @Inject()
  private readonly metadataStoreRespository: UploaderMetadataStoreRepository;

  constructor(private readonly eventBus: EventBus) {}

  private async uploadFileToMinIO(bucketName: string, file: FileMetadata) {
    try {
      return this.objectStoreRespository.putObject(
        bucketName,
        file.args.fileName,
        file.args.fileMulter.buffer,
        file.args.fileMulter.buffer.length,
        { 'Content-Type': file.args.fileMulter.mimetype },
      );
    } catch (error) {
      throw new Error(`Failed to upload file to MinIO: ${error.message}`);
    }
  }

  private async saveFileMetadata(file: FileMetadata) {
    try {
      const fileResult = await this.metadataStoreRespository.saveFileMetadata(
        mapFileMetadataToDocument(file),
      );
      return fileResult;
    } catch (error) {
      throw new Error(
        `Failed to save file metadata to MongoDB: ${error.message}`,
      );
    }
  }

  async execute(command: UploadFilesCommand) {
    const { bucketName, files } = command;

    if (!(await this.objectStoreRespository.bucketExists(bucketName))) {
      throw new NotFoundException('Bukket not exist');
    }

    // Extract file info from file.
    const extractedFiles: Array<FileMetadata> = [];
    for (const file of files) {
      const fileMetadata = new FileMetadata();
      fileMetadata.extractFromFileByDefaultPolicy(bucketName, file);
      fileMetadata.commit();
      extractedFiles.push(fileMetadata);
    }

    // Upload file to MinIO
    // Save file metadata to MongoDB
    const uploadedResult: Array<any> = [];
    for (const file of extractedFiles) {
      let uploadedObjectInfo: any;
      let fileMetadata: any;

      const result: any = {};

      try {
        uploadedObjectInfo = await this.uploadFileToMinIO(bucketName, file);
        fileMetadata = await this.saveFileMetadata(file);
        result.uploadedObjectInfo = uploadedObjectInfo;
        result.fileMetadata = fileMetadata;

        uploadedResult.push(result);
      } catch (error) {
        console.error(`Error processing file ${file.args.fileName}:`, error);

        result.file = file;
        result.error = error.message;

        uploadedResult.push(result);
      }
      this.eventBus.publish(new FileUploadedEvent(file));
    }

    return uploadedResult;
  }
}
