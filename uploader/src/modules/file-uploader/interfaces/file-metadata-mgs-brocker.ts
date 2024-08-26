export interface FileMetadataMessageBrockerItem {
  fileId: string;
  filePath?: string;
  resolutions: Array<{
    preSignUrl: string; // https://minio/presiton url
    resolution: string; // '1920x2020'
  }>;
  timeStamp: Date;
}
