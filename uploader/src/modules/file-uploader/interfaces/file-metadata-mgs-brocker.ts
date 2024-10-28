export interface FileMetadataMessageBrockerItem {
  fileId: string;
  bucketName: string;
  filePath?: string;
  resolutions: Array<{
    preSignUrl: string; // https://minio/presiton url
    quality: number; // '1920x2020'
  }>;
  fileName: string;
  timeStamp: Date;
}
