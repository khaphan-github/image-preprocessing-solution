import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { FileMetadataStatus } from './file-metadata.model';
export type FileMetadataDocument = HydratedDocument<FileMetadataEntity>;

@Schema()
export class FileMetadataEntity {
  @Prop({
    type: Types.ObjectId,
    default: () => new Types.ObjectId(),
  })
  _id: Types.ObjectId;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  fileType: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: false })
  uploaderId: string;

  @Prop({ default: Date.now })
  uploadDate: Date;

  @Prop({ default: Date.now })
  lastModified: Date;

  @Prop({ required: true, enum: Object.values(FileMetadataStatus) })
  status: FileMetadataStatus;

  @Prop({ required: true })
  fileUrl: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: false })
  fileMulter: any;

  @Prop({ default: null })
  chunkSize: number;

  @Prop({ default: null })
  totalChunks: number;

  @Prop({ type: [String], default: null })
  chunkIds: string[];

  @Prop({ default: null })
  checksum: string;

  @Prop({ type: [Object], default: null })
  chunksMetadata: object[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: null })
  description: string;

  @Prop({
    type: {
      read: { type: [String], default: [] },
      write: { type: [String], default: [] },
      share: { type: [String], default: [] },
    },
    _id: false,
  })
  accessPermissions: {
    read: string[];
    write: string[];
    share: string[];
  };

  @Prop({ default: null })
  parentFolderId: string;

  @Prop({ default: false })
  isTrashed: boolean;

  @Prop({ default: null })
  trashDate: Date;
}

export const FileMetadataEntitySchema =
  SchemaFactory.createForClass(FileMetadataEntity);
