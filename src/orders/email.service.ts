import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Order } from './schemas/order.schema';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER') || 'phibuinek@gmail.com',
        pass: this.configService.get<string>('EMAIL_PASSWORD'), // App password from Gmail
      },
    });
  }

  async sendInvoiceEmail(order: Order): Promise<void> {
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const itemsHtml = order.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${(item.price / 100).toFixed(2)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${((item.price * item.quantity) / 100).toFixed(2)}</td>
      </tr>
    `,
      )
      .join('');

    const totalAmount = (order.totalAmount / 100).toFixed(2);

    const orderId = (order as any)._id?.toString() || (order as any).id?.toString() || 'UNKNOWN';
    const orderIdShort = orderId.slice(-8).toUpperCase();

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%);
      padding: 30px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      margin: 0;
      color: #8b6914;
      font-size: 28px;
    }
    .content {
      background: #ffffff;
      padding: 30px;
      border: 1px solid #e5e7eb;
      border-top: none;
    }
    .thank-you {
      font-size: 18px;
      color: #059669;
      margin-bottom: 20px;
      font-weight: bold;
    }
    .order-info {
      background: #f9fafb;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .order-info p {
      margin: 8px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th {
      background: #f3f4f6;
      padding: 12px;
      text-align: left;
      font-weight: bold;
      border-bottom: 2px solid #e5e7eb;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    .total {
      text-align: right;
      font-size: 20px;
      font-weight: bold;
      color: #d4af37;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #6b7280;
      font-size: 14px;
      border-top: 1px solid #e5e7eb;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Pham's Nail Supplies</h1>
  </div>
  <div class="content">
    <div class="thank-you">Thank you for your purchase! 🎉</div>
    
    <p>Dear ${order.username || 'Valued Customer'},</p>
    
    <p>We are delighted to confirm your order. Your invoice is attached below.</p>
    
    <div class="order-info">
      <p><strong>Order Number:</strong> #${orderIdShort}</p>
      <p><strong>Order Date:</strong> ${orderDate}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod === 'credit_card' ? 'Stripe' : order.paymentMethod}</p>
      ${order.shippingAddress ? `<p><strong>Shipping Address:</strong> ${order.shippingAddress}</p>` : ''}
    </div>
    
    <h3 style="margin-top: 30px;">Order Details:</h3>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th style="text-align: center;">Quantity</th>
          <th style="text-align: right;">Unit Price</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>
    
    <div class="total">
      Total Amount: $${totalAmount}
    </div>
    
    <p style="margin-top: 30px;">
      We truly appreciate your business and look forward to serving you again. 
      If you have any questions or concerns, please don't hesitate to contact us.
    </p>
    
    <p>Best regards,<br>
    <strong>Pham's Nail Supplies Team</strong></p>
  </div>
  
  <div class="footer">
    <p>This is an automated email. Please do not reply to this message.</p>
    <p>© ${new Date().getFullYear()} Pham's Nail Supplies. All rights reserved.</p>
  </div>
</body>
</html>
    `;

    const mailOptions = {
      from: {
        name: "Pham's nail supplies",
        address: 'phibuinek@gmail.com',
      },
      to: order.email,
      subject: `Order Confirmation - #${orderIdShort}`,
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Invoice email sent successfully to ${order.email}`);
    } catch (error) {
      console.error('Error sending invoice email:', error);
      throw error;
    }
  }
}

