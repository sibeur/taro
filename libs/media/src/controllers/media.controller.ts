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
  HttpCode,
} from '@nestjs/common';
import { MediaService } from '@core/media/services/media.service';
import { FileUpload } from '@core/media/decorators/file_upload.decorator';
import { FileUploadGuard } from '@core/media/guards/file_upload.guard';
import { IUploadMedia } from '@core/media/typesAndInterface/media';
import { Auth } from '@core/simple-auth/decorators/auth.decorator';
import { Role } from '@core/simple-auth/typesAndInterface/role';
import { HttpOkResponseInterceptor } from '@core/common/interceptors/http.interceptor';
import { MediaIdsDto } from '../dtos/media.dto';
import { MediaDeleteEvent } from '../typesAndInterface/event';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('media')
export class MediaController {
  constructor(
    private mediaService: MediaService,
    private eventEmitter: EventEmitter2,
  ) {}

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
  async commitMedias(@Body() params: MediaIdsDto) {
    await this.mediaService.commitMedias(params.mediaIds);
    return {};
  }

  @UseInterceptors(HttpOkResponseInterceptor)
  @Post('drop')
  @Version('1')
  @Auth(Role.ADMIN, Role.UPLOADER)
  async deleteMedias(@Body() params: MediaIdsDto) {
    const medias = await this.mediaService.getMediaByIds(params.mediaIds);
    this.eventEmitter.emit('media.delete', new MediaDeleteEvent(medias));
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
