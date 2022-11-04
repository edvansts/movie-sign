import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { TDepartment, TGender } from 'src/types';

export type PersonDocument = Person & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Person {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop()
  gender?: TGender;

  @ApiProperty()
  @Prop({ required: true })
  lastPopularity: number;

  @ApiProperty()
  @Prop()
  profileImage: string | null;

  @Prop()
  tmdbId: string | null;

  @Prop()
  biography: string | null;

  @Prop()
  homepage?: string;

  @Prop()
  alsoKnowAs?: string[];

  @Prop()
  deathday?: string;

  @Prop()
  birthday?: string;

  @Prop()
  knownForDepartment?: TDepartment;
}

export const PersonSchema = SchemaFactory.createForClass(Person);
