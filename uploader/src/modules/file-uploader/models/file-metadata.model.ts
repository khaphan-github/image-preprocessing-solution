import { AggregateRoot } from '@nestjs/cqrs';
import { ChunkMetadata } from './file-metadata-chunk.model';
import { v4 as uuidv4 } from 'uuid';
import { FileMetadataMessageBrockerItem } from '../interfaces/file-metadata-mgs-brocker';
import { Types } from 'mongoose';
export enum FileMetadataStatus {
  COMPLETE = 'complete',
  INCOMPLETE = 'incomplete',
}

export class FileMetadata extends AggregateRoot {
  constructor(
    public args?: {
      _id: string | any;

      fileName: string;
      fileType: string;
      size: number;

      uploaderId: string;
      uploadDate: Date;
      lastModified: Date;

      status: FileMetadataStatus;

      fileUrl: string;
      fileMulter?: Express.Multer.File;
      chunkSize: number | null;
      totalChunks: number | null;
      chunkIds: string[] | null;
      checksum: string | null;
      chunksMetadata: Array<ChunkMetadata> | null;

      tags: string[];
      description: string | null;

      // uid
      accessPermissions: {
        read: string[];
        write: string[];
        share: string[];
      };

      parentFolderId: string | null;
      isTrashed: boolean;
      trashDate: Date | null;
    },
  ) {
    super();
    // Assigning default values or using provided ones
    this.args = {
      _id: args?._id || new Types.ObjectId(),
      fileName: args?.fileName || '',
      fileType: args?.fileType || '',
      size: args?.size || 0,

      uploaderId: args?.uploaderId || '',
      uploadDate: args?.uploadDate || new Date(),
      lastModified: args?.lastModified || new Date(),

      status: args?.status || FileMetadataStatus.INCOMPLETE,

      fileUrl: args?.fileUrl || '',
      fileMulter: args?.fileMulter,
      chunkSize: args?.chunkSize || null,
      totalChunks: args?.totalChunks || null,
      chunkIds: args?.chunkIds || null,
      checksum: args?.checksum || null,
      chunksMetadata: args?.chunksMetadata || null,

      tags: args?.tags || [],
      description: args?.description || null,

      accessPermissions: {
        read: args?.accessPermissions?.read || [],
        write: args?.accessPermissions?.write || [],
        share: args?.accessPermissions?.share || [],
      },

      parentFolderId: args?.parentFolderId || null,
      isTrashed: args?.isTrashed || false,
      trashDate: args?.trashDate || null,
    };
  }

  extractFromFileByDefaultPolicy(file: Express.Multer.File) {
    this.args['_id'] = new Types.ObjectId();
    this.args['fileName'] = uuidv4();
    this.args['fileUrl'] =
      'http://localhost/get/' +
      new Date().getTime() +
      this.args['originalname'];
    this.args['fileType'] = file['mimetype'];
    this.args['fileMulter'] = file;
  }

  getMgsBrockerMessage(): FileMetadataMessageBrockerItem {
    return {
      fileId: this.args._id,
      filePath: this.args.fileUrl,
      // TODO: IMPLEMENT LATTER
      resolutions: [],
      timeStamp: this.args.uploadDate,
    };
  }
}
