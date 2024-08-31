import { ICommand } from '@nestjs/cqrs';
import { FileMetadata } from '../../models/file-metadata.model';

export class PushMgsToMessageBrockerCommand implements ICommand {
  constructor(public readonly file: FileMetadata) {}
}


