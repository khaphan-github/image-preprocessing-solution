import { AggregateRoot } from '@nestjs/cqrs';
import { ChunkMetadata } from './file-metadata-chunk.model';
import { v4 as uuidv4 } from 'uuid';
import { FileMetadataMessageBrockerItem } from '../interfaces/file-metadata-mgs-brocker';
export enum FileMetadataStatus {
  COMPLETE = 'complete',
  INCOMPLETE = 'incomplete',
}

export class FileMetadata extends AggregateRoot {
  constructor(
    public args?: {
      readonly _id: string;

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
    this.args = {} as any;
  }

  extractFromFileByDefaultPolicy(file: Express.Multer.File) {
    this.args['fileName'] = file?.filename ?? uuidv4();
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
