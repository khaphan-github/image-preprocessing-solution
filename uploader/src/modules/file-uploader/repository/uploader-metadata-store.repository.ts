import { Injectable, Inject } from '@nestjs/common';
import { Model, Mongoose, Document } from 'mongoose';
import {
  FileMetadataDocument,
  FileMetadataEntity,
} from '../models/file-metadata.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UploaderMetadataStoreRepository {
  constructor(
    @InjectModel(FileMetadataEntity.name)
    private FileMetadataDocumenModel: Model<FileMetadataEntity>,
  ) {}
  async saveFileMetadata(fileMetadata: Partial<FileMetadataDocument>) {
    const metadata = new this.FileMetadataDocumenModel(fileMetadata);
    return metadata.save();
  }
}
