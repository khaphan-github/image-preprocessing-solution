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
      bucketName: string,
      fileDisplayName: string;
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
      bucketName: args?.bucketName || '',
      fileDisplayName: args?.fileDisplayName || '',
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

  /**
   * Extrac info from file to without chunksize.
   * @param file
   */
  extractFromFileByDefaultPolicy(bucketName: string,file: Express.Multer.File) {
    this.args['_id'] = new Types.ObjectId();
    this.args['bucketName'] = bucketName;

    // File info
    this.args['fileName'] = uuidv4();
    this.args['fileDisplayName'] = file.originalname;
    this.args['fileType'] = file['mimetype'];
    this.args['size'] = file.size;

    // File URL
    // http://localhost:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL3Rlc3QvMDAwOWExMTEtZWIzOC00MTY3LWI0MDYtYTBiMTQzMDdkZjhiP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9SVkzRktVOEhMM05ZSTdZQzRDQUMlMkYyMDI0MDgzMSUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNDA4MzFUMTMxODEyWiZYLUFtei1FeHBpcmVzPTQzMTk5JlgtQW16LVNlY3VyaXR5LVRva2VuPWV5SmhiR2NpT2lKSVV6VXhNaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpoWTJObGMzTkxaWGtpT2lKSldUTkdTMVU0U0V3elRsbEpOMWxETkVOQlF5SXNJbVY0Y0NJNk1UY3lOVEUxTXpRM05Td2ljR0Z5Wlc1MElqb2liV2x1YVc5aFpHMXBiaUo5LmRHTDZfd29UblFuNGlfSGx5WGROYVVEeDBUM2dPdks5elJ2Tlo4UU9uc0hmMkwwdEljUUJEaGdqOWNrYVV5T09QT3g0eC1GZDhWV3lIVWRZcEhsbmpnJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZ2ZXJzaW9uSWQ9bnVsbCZYLUFtei1TaWduYXR1cmU9NmUyNGFhNDUzOWU5ZWQ1MDg1ZGQ5Yjc5ODI0NmZiOGZiY2Q2NTcyYzVmNmIxZGYzZjI5NWZjNjc2NjQ4MzNkYQ
    this.args['fileUrl'] = uuidv4();

    /// Uploader info
    this.args['uploaderId'] = uuidv4();
    this.args['uploadDate'] = new Date();
    this.args['lastModified'] = new Date();

    // Status
    this.args['status'] = FileMetadataStatus.INCOMPLETE;

    // Chunks
    // TODO: Implement checksum logic.
    this.args['fileMulter'] = file;

    this.args['chunkSize'] = null;
    this.args['totalChunks'] = null;
    this.args['chunkIds'] = null;
    this.args['checksum'] = null;
    this.args['chunksMetadata'] = null;

    // Permission
    this.args['accessPermissions'] = {
      read: ['public'], // or user id
      write: ['public'],
      share: [],
    };

    // Parent folder
    this.args['parentFolderId'] = null;

    // Trash
    this.args['isTrashed'] = false;
    this.args['trashDate'] = null;

    // Description
    this.args['description'] = null;
  }

  getMgsBrockerMessage(): FileMetadataMessageBrockerItem {
    return {
      fileId: this.args._id,
      bucketName: this.args.bucketName,
      filePath: this.args.fileUrl,
      resolutions: [],
      timeStamp: this.args.uploadDate,
    };
  }
}
