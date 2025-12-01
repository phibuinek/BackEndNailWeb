
export class CreateOrderDto {
  userId?: string;
  username?: string;
  email: string;
  items: {
    productId: number;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: string;
}

