import {
  Controller,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
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
  @ApiParam({
    name: 'bucket',
    description: 'Name of the bucket where files will be uploaded',
    example: 'test',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async uploadFiles(
    @Param('bucket') bucketName: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const filesResult = await this.commandBus.execute(
      new UploadFilesCommand(bucketName, files),
    );
    return {
      success: true,
      path: filesResult,
    };
  }
}
