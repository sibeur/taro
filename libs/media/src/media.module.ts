import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaService } from './services/media.service';
import { MediaModel, MediaSchema } from './schemas/media.schema';
import { MediaRuleModel, MediaRuleSchema } from './schemas/media_rule.schema';
import { MediaRepository } from './repositories/media.repository';
import { RuleRepository } from './repositories/rule.repository';
import { MediaController } from './controllers/media.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskSchedulerService } from './services/task-scheduler.service';
import { RuleService } from './services/rule.service';
import { MediaRuleController } from './controllers/media-rule.controller';
import { SimpleAuthModule } from '@core/simple-auth';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MediaEventService } from './services/media-event.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '@core/common/filters/all_exception.filter';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MediaRuleModel.collName, schema: MediaRuleSchema },
      { name: MediaModel.collName, schema: MediaSchema },
    ]),
  ],
  providers: [
    MediaService,
    MediaRepository,
    RuleRepository,
    RuleService,
    MediaEventService,
  ],
  exports: [MediaService, RuleService],
})
export class MediaModule {
  static coreRestAPIApp(): DynamicModule {
    return {
      module: MediaModule,
      imports: [
        ScheduleModule.forRoot(),
        SimpleAuthModule.forFeature(),
        EventEmitterModule.forRoot(),
      ],
      providers: [
        TaskSchedulerService,
        {
          provide: APP_FILTER,
          useClass: AllExceptionsFilter,
        },
      ],
      controllers: [MediaController, MediaRuleController],
    };
  }
}
