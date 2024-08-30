import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { bufferTime, map, Observable, of } from 'rxjs';
import { FileUploadedEvent } from '../events/file-uploaded.event';
import { PushMgsToMessageBrockerCommand } from '../commands/impl/push-mgs-to-message-broker.command';

export class FileUploaderSaga {
  @Saga()
  fileUploaded = (events$: Observable<unknown>): Observable<ICommand> => {
    return events$.pipe(
      ofType(FileUploadedEvent),
      map((event) => {
        return new PushMgsToMessageBrockerCommand(event.file);
      }),
    );
  };
}
