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
  Delete,
  Query,
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
import { TaskSchedulerService } from '../services/task-scheduler.service';
import { RQNParams } from '@core/common/decorators/rqn.decorator';
import { RQNDataListParams } from '@core/common/rqn/rqn.base';

@Controller('media')
export class MediaController {
  constructor(
    private mediaService: MediaService,
    private eventEmitter: EventEmitter2,
    private taskService: TaskSchedulerService,
  ) {}
  
  @UseInterceptors(HttpOkResponseInterceptor)
  @Version('1')
  @Get()
  @Auth(Role.ADMIN, Role.UPLOADER)
  async index(@RQNParams() params: RQNDataListParams) {
    return {
      data: await this.mediaService.find(params),
    };
  }

  @UseInterceptors(HttpOkResponseInterceptor)
  @Version('1')
  @Get(':ruleName/storage-stats')
  @Auth(Role.ADMIN, Role.UPLOADER)
  async stats(@Param('ruleName') ruleName: string) {
    return {
      data: await this.mediaService.getMediaStorageStats(ruleName),
    };
  }

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
  @Delete('drop')
  @Version('1')
  @Auth(Role.ADMIN, Role.UPLOADER)
  async dropMedias(@Body() params: MediaIdsDto) {
    const medias = await this.mediaService.getMediaByIds(params.mediaIds);
    this.eventEmitter.emit('media.delete', new MediaDeleteEvent(medias));
    return {};
  }

  @UseInterceptors(HttpOkResponseInterceptor)
  @Delete('clean')
  @Version('1')
  @Auth(Role.ADMIN, Role.UPLOADER)
  async cleanMedias() {
    await this.taskService.cleanMedia();
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
