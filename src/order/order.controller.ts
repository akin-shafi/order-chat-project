/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request as Req } from '@nestjs/common'; // Renaming the decorator import
import { CustomRequest } from '../types/custom-request.interface'; // Import CustomRequest
import { Roles } from '../auth/roles.decorator'; // Import Roles decorator
import { Role } from '../role.enum'; // Import Role enum


@ApiTags('orders')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'The order has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  async createOrder(@Req() req: CustomRequest, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.userId;
    return this.orderService.createOrder(createOrderDto, userId);
  }

  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get all orders for the user' })
  @ApiResponse({ status: 200, description: 'A list of orders' })
  async getOrders(@Req() req: CustomRequest) {
    console.log("req:",req.user);
    const userId = req.user.id;
    const isAdmin = req.user.role === Role.ADMIN;
    return this.orderService.getOrders(userId, isAdmin);
  }

  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Update an order' })
  @ApiResponse({ status: 200, description: 'The order has been successfully updated.' })
  async updateOrder(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.updateOrder(Number(id), updateOrderDto);
  }

  @ApiBearerAuth()
  // @UseGuards(RolesGuard)
  @Patch(':orderId/complete')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Mark an order as completed' })
  @ApiResponse({ status: 200, description: 'The order has been successfully marked as completed.' })
  async completeOrder(
    @Param('orderId') orderId: number, 
    @Req() req: CustomRequest
  ) {
    const adminId = req.user.userId;
    return this.orderService.completeOrder(Number(orderId), adminId);
  }
}


