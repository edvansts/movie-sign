import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { hash } from 'bcrypt';

@Schema({
  timestamps: true,
  versionKey: false,
})
class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
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
