import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string; // Hashed password

  @Prop({ required: true, enum: ['admin', 'customer'], default: 'customer' })
  role: string;

  @Prop({ required: false })
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

