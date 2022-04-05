import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as Scm } from 'mongoose';
import { MediaRuleDoc } from './media_rule.schema';

export type MediaDoc = MediaModel & Document;

@Schema()
export class MediaModel {
  static collName = 'media';
  @Prop({ type: Scm.Types.Mixed })
  rule?: MediaRuleDoc;

  @Prop({ index: true })
  aliasName: string;

  @Prop()
  originalName: string;

  @Prop()
  path: string;

  @Prop()
  url: string;

  @Prop()
  size: number;

  @Prop()
  mime: string;

  @Prop()
  ext: string;

  @Prop()
  commit: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const MediaSchema = SchemaFactory.createForClass(MediaModel);
