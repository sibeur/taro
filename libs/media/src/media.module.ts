import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { SimpleAuthModule } from '@core/simple-auth';
import { APP_FILTER } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AllExceptionsFilter } from '@core/common/filters/all_exception.filter';
import { MediaRepository, RuleRepository } from './repositories';
import { MediaController, MediaRuleController } from './controllers';
import { MediaModel, MediaSchema, MediaRuleModel, MediaRuleSchema } from './schemas';
import { RuleService, TaskSchedulerService, MediaEventService, MediaService } from './services';

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
