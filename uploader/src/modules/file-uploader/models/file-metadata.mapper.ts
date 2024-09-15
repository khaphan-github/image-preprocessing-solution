import { ChunkMetadata } from './file-metadata-chunk.model';
import { FileMetadataDocument } from './file-metadata.entity';
import { FileMetadata, FileMetadataStatus } from './file-metadata.model';

export const mapDocumentToFileMetadata = (
  doc: FileMetadataDocument,
): FileMetadata => {
  return new FileMetadata({
    _id: doc._id.toString(),
    fileName: doc.fileName,
    fileDisplayName: doc.fileDisplayName,
    bucketName: doc.bucketName,
    fileType: doc.fileType,
    size: doc.size,
    uploaderId: doc.uploaderId,
    uploadDate: doc.uploadDate,
    lastModified: doc.lastModified,
    status: doc.status as FileMetadataStatus, // Assuming the status enums match
    fileUrl: doc.fileUrl,
    fileMulter: doc.fileMulter as Express.Multer.File,
    chunkSize: doc.chunkSize,
    totalChunks: doc.totalChunks,
    chunkIds: doc.chunkIds,
    checksum: doc.checksum,
    chunksMetadata: doc.chunksMetadata as Array<ChunkMetadata>,
    tags: doc.tags,
    description: doc.description,
    accessPermissions: {
      read: doc.accessPermissions.read,
      write: doc.accessPermissions.write,
      share: doc.accessPermissions.share,
    },
    parentFolderId: doc.parentFolderId,
    isTrashed: doc.isTrashed,
    trashDate: doc.trashDate,
  });
};

export const mapFileMetadataToDocument = (
  fileMetadata: FileMetadata,
): Partial<FileMetadataDocument> => {
  return {
    _id: fileMetadata.args._id,
    fileName: fileMetadata.args.fileName,
    fileDisplayName: fileMetadata.args.fileDisplayName,
    bucketName: fileMetadata.args.bucketName,
    fileType: fileMetadata.args.fileType,
    size: fileMetadata.args.size,
    uploaderId: fileMetadata.args.uploaderId,
    uploadDate: fileMetadata.args.uploadDate,
    lastModified: fileMetadata.args.lastModified,
    status: fileMetadata.args.status as FileMetadataStatus,
    fileUrl: fileMetadata.args.fileUrl,
    // fileMulter: fileMetadata.args.fileMulter as any, // Type cast to `any` as Mongoose doesn't store multer file objects
    chunkSize: fileMetadata.args.chunkSize,
    totalChunks: fileMetadata.args.totalChunks,
    chunkIds: fileMetadata.args.chunkIds,
    checksum: fileMetadata.args.checksum,
    chunksMetadata: fileMetadata.args.chunksMetadata as any, // Type cast to `any`
    tags: fileMetadata.args.tags,
    description: fileMetadata.args.description,
    accessPermissions: {
      read: fileMetadata.args.accessPermissions.read,
      write: fileMetadata.args.accessPermissions.write,
      share: fileMetadata.args.accessPermissions.share,
    },
    parentFolderId: fileMetadata.args.parentFolderId,
    isTrashed: fileMetadata.args.isTrashed,
    trashDate: fileMetadata.args.trashDate,
  };
};
