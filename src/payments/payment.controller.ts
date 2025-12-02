import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-payment-intent')
  async createPaymentIntent(@Body() body: { amount: number }) {
    // In a real app, calculate amount on backend based on cart items from DB
    // Here we trust the amount for simplicity as per instruction context
    return this.paymentService.createPaymentIntent(body.amount);
  }
}

