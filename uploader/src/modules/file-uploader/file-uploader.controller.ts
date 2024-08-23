import {
  Controller,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { UploadFilesCommand } from './commands/impl/upload-files.command';

@Controller('uploader')
@ApiTags('Uploader')
export class FileUploaderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('files/:bucket')
  @UseInterceptors(FilesInterceptor('files', 1000, {}))
  async uploadFiles(
    @Param('bucket') bucketName: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const filesResult = await this.commandBus.execute(
      new UploadFilesCommand(bucketName, files),
    );
    return filesResult;
  }
}
