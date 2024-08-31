import { PushMgsToMessageBrockerCommandHandler } from './push-mgs-to-message-brocker';
import { UploadFileCommandHandler } from './upload-files.handler';

export const CommandHandlers = [
  UploadFileCommandHandler,
  PushMgsToMessageBrockerCommandHandler,
];
