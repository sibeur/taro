import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../typesAndInterface/role';

export type ClientDoc = ClientModel & Document;

@Schema()
export class ClientModel {
  static collName = 'client';

  @Prop({ index: true })
  clientId: string;

  @Prop()
  secretKey: string;

  @Prop({ type: String })
  role: Role;
}

export const ClientSchema = SchemaFactory.createForClass(ClientModel);
