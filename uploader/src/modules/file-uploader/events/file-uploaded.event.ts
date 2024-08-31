import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { FileMetadata } from '../models/file-metadata.model';

export class FileUploadedEvent {
  constructor(public readonly file: FileMetadata) {}
}

@EventsHandler(FileUploadedEvent)
export class FileUploadedEventHandler
  implements IEventHandler<FileUploadedEvent>
{
  handle(event: FileUploadedEvent) {
    console.log(event);
  }
}
