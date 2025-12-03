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

@Schema({ timestamps: true })
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

  @Prop([String])
  images: string[];

  @Prop({ type: LocalizedString, index: true })
  category: LocalizedString;

  @Prop({ default: 0 })
  sold: number;

  @Prop({ default: 0 })
  discount: number; // 0 to 100

  createdAt?: Date;
  updatedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ sold: -1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ 'name.en': 'text', 'name.vi': 'text' });
