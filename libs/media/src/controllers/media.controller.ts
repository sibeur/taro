import {
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
  Response,
  StreamableFile,
  Version,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { MediaService } from '@core/media/services/media.service';
import { FileUpload } from '@core/media/decorators/file_upload.decorator';
import { FileUploadGuard } from '@core/media/guards/file_upload.guard';
import { IUploadMedia } from '@core/media/typesAndInterface/media';
import { Auth } from '@core/simple-auth/decorators/auth.decorator';
import { Role } from '@core/simple-auth/typesAndInterface/role';
import { HttpOkResponseInterceptor } from '@core/common/interceptors/http.interceptor';
import { CommitMediaDto } from '../dtos/media.dto';

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @UseInterceptors(HttpOkResponseInterceptor)
  @Post()
  @Version('1')
  @UseGuards(FileUploadGuard)
  @Auth(Role.ADMIN, Role.UPLOADER)
  async uploadMedia(
    @Headers('commit') commit: boolean,
    @FileUpload() dataUpload: IUploadMedia,
  ) {
    return {
      data: await this.mediaService.upload(dataUpload, commit),
    };
  }

  @UseInterceptors(HttpOkResponseInterceptor)
  @Post('commit')
  @Version('1')
  @Auth(Role.ADMIN, Role.UPLOADER)
  async commitMedias(@Body() params: CommitMediaDto) {
    await this.mediaService.commitMedias(params.mediaIds);
    return {};
  }

  @Get(':ruleName/:aliasName')
  async showMedia(
    @Param('ruleName') ruleName: string,
    @Param('aliasName') aliasName: string,
    @Response({ passthrough: true }) res,
  ): Promise<StreamableFile> {
    const mediaStream = await this.mediaService.openMedia(ruleName, aliasName);
    res.headers({
      'Content-Type': mediaStream.fileMime,
      'Content-Disposition': `attachment; filename="${mediaStream.fileName}"`,
    });
    return new StreamableFile(mediaStream.file);
  }
}
