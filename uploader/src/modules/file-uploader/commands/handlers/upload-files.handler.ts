import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UploadFilesCommand } from '../impl/upload-files.command';
import { Inject, NotFoundException } from '@nestjs/common';

import {
  MINIO_PROVIDER_CONNECTION,
  MONGODB_PROVIDER_CONNECTION,
} from 'src/infrastructure';
import { Client } from 'minio';
import { Mongoose } from 'mongoose';
import { FileMetadata } from '../../models/file-metadata.model';

@CommandHandler(UploadFilesCommand)
export class UploadFileCommandHandler
  implements ICommandHandler<UploadFilesCommand>
{
  // TODO: Move this logic to repository.
  @Inject(MINIO_PROVIDER_CONNECTION) private readonly objectStorage: Client;

  @Inject(MONGODB_PROVIDER_CONNECTION)
  private readonly documentStorage: Mongoose;

  constructor(private readonly publisher: EventPublisher) {}

  async execute(command: UploadFilesCommand) {
    const { bucketName, files } = command;

    if (!(await this.objectStorage.bucketExists(bucketName))) {
      throw new NotFoundException('Bukket not exist');
    }

    // Extract file info from file.
    const extractedFiles: Array<FileMetadata> = [];
    for (const file of files) {
      const fileMetadata = new FileMetadata();
      fileMetadata.extractFromFileByDefaultPolicy(file);
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
    }
    return uploadedResult;
  }

  private async uploadFileToMinIO(bucketName: string, file: FileMetadata) {
    try {
      return this.objectStorage.putObject(
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
      // await this.documentStorage.;
      console.log(file);
      return { oke: 'be' };
    } catch (error) {
      throw new Error(
        `Failed to save file metadata to MongoDB: ${error.message}`,
      );
    }
  }
}
