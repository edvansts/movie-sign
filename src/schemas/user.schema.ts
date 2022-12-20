import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { hash } from 'bcrypt';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
  timestamps: true,
  versionKey: false,
})
class User {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  @Exclude()
  password?: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @Prop({ default: false })
  isRegisteredWithGoogle: boolean;

  @ApiProperty()
  @Prop({ default: false })
  isEmailValidated: boolean;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    const hashed = await hash(this.password, 10);

    this.password = hashed;

    return next();
  } catch (err) {
    return next(err);
  }
});

export { UserSchema, User };
export type UserDocument = User & Document;
