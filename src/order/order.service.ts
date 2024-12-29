/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto, userId: number) {
    const order = await this.prisma.order.create({
      data: {
        ...createOrderDto,
        status: 'REVIEW',
        userId: userId,
      },
    });

    const chatRoom = await this.prisma.chatRoom.create({
      data: {
        order: { connect: { id: order.id } },
      },
    });

    // Update the order with the chatRoomId
    const updatedOrder = await this.prisma.order.update({
      where: { id: order.id },
      data: { chatRoomId: chatRoom.id },
    });

    return updatedOrder;
  }

  async getOrders(userId: number, isAdmin: boolean) {
    if (isAdmin) {
      return this.prisma.order.findMany();
    }
    return this.prisma.order.findMany({ where: { userId: userId } });
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto) {
    return this.prisma.order.update({
      where: { id: id },
      data: updateOrderDto,
    });
  }
}
