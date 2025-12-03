
import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  // @UseGuards(JwtAuthGuard) // Uncomment to protect admin route if needed
  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get('user/:username')
  async findByUser(@Param('username') username: string) {
    return this.ordersService.findByUsername(username);
  }
}

