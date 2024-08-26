import { ICommand } from '@nestjs/cqrs';

export class UploadFilesCommand implements ICommand {
  constructor(
    public readonly bucketName: string,
    public readonly files: Express.Multer.File[],
  ) {}
}
