import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as Scm } from 'mongoose';
import {
  MediaRuleOptions,
  MediaValidationRule,
} from '@core/media/typesAndInterface/media_rule';

export type MediaRuleDoc = MediaRuleModel & Document;

@Schema()
export class MediaRuleModel {
  static collName = 'mediaRule';
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ type: Scm.Types.Mixed })
  validations: MediaValidationRule;

  @Prop({ type: Scm.Types.Mixed })
  options: MediaRuleOptions;
}

export const MediaRuleSchema = SchemaFactory.createForClass(MediaRuleModel);
