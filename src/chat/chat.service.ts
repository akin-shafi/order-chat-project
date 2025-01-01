/* eslint-disable prettier/prettier */
// chat.service
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { EmailService } from '../email/email.service'; // Import EmailService

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService, // Inject EmailService
  ) {}

  async sendMessage(chatRoomId: number, senderId: number, sendMessageDto: SendMessageDto) {
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
    });

    if (!chatRoom || chatRoom.status !== 'OPEN') {
      throw new ForbiddenException('Cannot send message to a closed chat room');
    }

    return this.prisma.message.create({
      data: {
        ...sendMessageDto,
        senderId: senderId,
        chatRoomId: chatRoomId,
      },
    });
  }


  async getMessages(chatRoomId: number, userId: number) {
    const chatRoom = await this.prisma.chatRoom.findUnique({ where: { id: chatRoomId } });
    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    const isParticipant = await this.prisma.user.findFirst({
      where: {
        id: userId,
        OR: [
          { role: 'ADMIN' },
          {
            orders: {
              some: { chatRoomId: chatRoomId },
            },
          },
        ],
      },
    });

    if (!isParticipant) {
      throw new ForbiddenException('User role is unauthorized to fetch all messages.');
    }

    return this.prisma.message.findMany({ where: { chatRoomId: chatRoomId } });
  }

  async updateMessage(messageId: number, senderId: number, updateMessageDto: UpdateMessageDto) {
    // Check if the message exists and belongs to the sender
    const message = await this.prisma.message.findUnique({ where: { id: messageId } });
    if (!message || message.senderId !== senderId) {
      throw new NotFoundException('Message not found or you are not the author');
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: { ...updateMessageDto },
    });
  }

  async deleteMessage(messageId: number, senderId: number) {
    // Check if the message exists and belongs to the sender
    const message = await this.prisma.message.findUnique({ where: { id: messageId } });
    if (!message || message.senderId !== senderId) {
      throw new NotFoundException('Message not found or you are not the author');
    }

    return this.prisma.message.delete({ where: { id: messageId } });
  }

  async deleteAllMessagesInRoom(chatRoomId: number) {
    // Check if the chat room exists
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
    });

    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    // Delete all messages from the chat room
    await this.prisma.message.deleteMany({
      where: {
        chatRoomId: chatRoomId,
      },
    });

    return { message: 'All messages have been successfully deleted.' };
  }
  

  async closeChatRoom(chatRoomId: number, concludingMessage: string, adminId: number) {
    // Fetch the chat room and update its status
    const chatRoom = await this.prisma.chatRoom.update({
      where: { id: chatRoomId },
      data: { status: 'CLOSED' },
    });

    // Find related order
    const order = await this.prisma.order.findUnique({ where: { chatRoomId: chatRoomId } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Update order status to PROCESSING after chat room is closed
    await this.prisma.order.update({
      where: { id: order.id },
      data: { status: 'PROCESSING' },
    });
    
    
  
    // Fetch related messages
    const messages = await this.prisma.message.findMany({ where: { chatRoomId: chatRoomId } });
  
    // Compose chat summary
    const chatSummary = messages.map((msg) => `${msg.sentAt}: ${msg.content}`).join('\n');
  
    // Fetch participants' emails
    const participants = await this.prisma.user.findMany({
      where: { OR: [{ orders: { some: { chatRoomId: chatRoomId } } }, { role: 'ADMIN' }] },
      select: { email: true },
    });
  
    // Send chat summary email to all participants
    for (const participant of participants) {
      await this.emailService.sendChatSummaryEmail(participant.email, `Chat summary:\n\n${chatSummary}`);
    }
  
    // Add concluding message to chat room
    await this.prisma.message.create({
      data: {
        content: concludingMessage, // Ensure content is properly passed
        chatRoomId: chatRoomId,
        senderId: adminId, // Use adminId for sender
      },
    });
  
    return chatRoom;
  }
}
