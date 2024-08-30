import { Inject, Injectable } from '@nestjs/common';
import { Client, ItemBucketMetadata } from 'minio';
import { MINIO_PROVIDER_CONNECTION } from 'src/infrastructure';
import * as stream from 'node:stream';

@Injectable()
export class UploaderObjectStoreRepository {
  @Inject(MINIO_PROVIDER_CONNECTION) private readonly objectStorage: Client;

  bucketExists(name: string) {
    return this.objectStorage.bucketExists(name);
  }

  putObject(
    bucketName: string,
    objectName: string,
    stream: stream.Readable | Buffer | string,
    size?: number,
    metaData?: ItemBucketMetadata,
  ) {
    return this.objectStorage.putObject(
      bucketName,
      objectName,
      stream,
      size,
      metaData,
    );
  }
}
