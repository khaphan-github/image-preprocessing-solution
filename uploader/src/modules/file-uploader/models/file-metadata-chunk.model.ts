import { AggregateRoot } from '@nestjs/cqrs';

export class ChunkMetadata extends AggregateRoot {
  constructor(
    public readonly _id: string,
    public readonly fileId: string,
    public readonly chunkIndex: number,
    public readonly fileUrl: string,
    public readonly size: number,
    public readonly checksum: string | null,
    public readonly uploadDate: Date,
  ) {
    super();
  }
}
