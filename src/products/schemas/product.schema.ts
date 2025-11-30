import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class LocalizedString {
  @Prop()
  en: string;

  @Prop()
  vi: string;
}

@Schema()
export class Product {
  @Prop({ unique: true })
  id: number;

  @Prop({ type: LocalizedString })
  name: LocalizedString;

  @Prop({ type: LocalizedString })
  description: LocalizedString;

  @Prop()
  price: number;

  @Prop()
  quantity: number;

  @Prop()
  rating: number;

  @Prop()
  image: string;

  @Prop({ type: LocalizedString })
  category: LocalizedString;

  @Prop({ default: Date.now })
  createdAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
