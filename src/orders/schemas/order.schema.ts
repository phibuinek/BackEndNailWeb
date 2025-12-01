
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class OrderItem {
  @Prop()
  productId: number;

  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  quantity: number;
}

@Schema()
export class Order {
  @Prop()
  userId: string; // Optional, for registered users

  @Prop()
  username: string; // Optional

  @Prop()
  email: string;

  @Prop({ type: [OrderItem] })
  items: OrderItem[];

  @Prop()
  totalAmount: number;

  @Prop({ default: 'pending' })
  status: string; // pending, completed, cancelled

  @Prop()
  paymentMethod: string; // stripe, store

  @Prop()
  shippingAddress: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

