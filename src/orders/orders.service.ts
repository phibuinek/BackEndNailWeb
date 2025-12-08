
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { EmailService } from './email.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private emailService: EmailService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  async findOne(id: string): Promise<Order | null> {
    return this.orderModel.findById(id).exec();
  }

  async sendInvoice(orderId: string): Promise<void> {
    const order = await this.findOne(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    try {
      await this.emailService.sendInvoiceEmail(order);
    } catch (error) {
      // Log error but don't throw - order creation should succeed even if email fails
      console.error(`Failed to send invoice email for order ${orderId}:`, error);
      // Return success anyway - email can be resent later
    }
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().sort({ createdAt: -1 }).exec();
  }

  async findByUsername(username: string): Promise<Order[]> {
    return this.orderModel.find({ username }).sort({ createdAt: -1 }).exec();
  }
}

