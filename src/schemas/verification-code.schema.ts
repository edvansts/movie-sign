import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
class VerificationCode {
  @Prop({ required: true, type: Number })
  code: number;

  @Prop({ type: Date, default: Date.now(), expires: '15 m' })
  expiresAt?: Date;
}

const VerificationCodeSchema = SchemaFactory.createForClass(VerificationCode);

export type VerificationCodeDocument = VerificationCode & Document;
export { VerificationCodeSchema, VerificationCode };
