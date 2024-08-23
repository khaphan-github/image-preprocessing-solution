import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { map, Observable, of } from 'rxjs';
import { FileUploadedEvent } from '../events/file-uploaded.event';

export class FileUploaderSaga {
  @Saga()
  fileUploaded = (events$: Observable<unknown>): Observable<ICommand> => {
    return events$.pipe(
      ofType(FileUploadedEvent),
      map((event) => {
        return of(true);
      }),
    );
  };
}
