/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Patch, Post, Delete, UseGuards, Request as Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard'; // Import RolesGuard
import { Roles } from '../auth/roles.decorator'; // Import Roles decorator
import { Role } from '../role.enum'; // Import Role enum
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CloseChatRoomDto } from './dto/close-chat-room.dto'; // Import DTO
import { CustomRequest } from '../types/custom-request.interface'; // Import CustomRequest

@ApiTags('chat')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiBearerAuth()
  @Post(':chatRoomId/messages')
  @ApiOperation({ summary: 'Send a message in a chat room' })
  @ApiResponse({ status: 201, description: 'The message has been successfully sent.' })
  async sendMessage(@Req() req: CustomRequest, @Param('chatRoomId') chatRoomId: number, @Body() sendMessageDto: SendMessageDto) {
    const senderId = req.user.userId;
    return this.chatService.sendMessage(Number(chatRoomId), senderId, sendMessageDto);
  }

  @ApiBearerAuth()
  @Get(':chatRoomId/messages')
  @ApiOperation({ summary: 'Get all messages in a chat room' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully.' })
  async getMessages(@Param('chatRoomId') chatRoomId: number, @Req() req: CustomRequest) {
    const userId = req.user.userId; // Extract userId from the request
    return this.chatService.getMessages(Number(chatRoomId), userId); // Pass userId to the service method
  }

  @ApiBearerAuth()
  @Patch('messages/:messageId')
  @ApiOperation({ summary: 'Update a message by id' })
  @ApiResponse({ status: 200, description: 'Message updated successfully.' })
  async updateMessage(@Req() req: CustomRequest, @Param('messageId') messageId: number, @Body() updateMessageDto: UpdateMessageDto) {
    const senderId = req.user.userId;
    return this.chatService.updateMessage(Number(messageId), senderId, updateMessageDto);
  }

  @ApiBearerAuth()
  @Delete('messages/:messageId')
  @ApiOperation({ summary: 'Delete a message by id' })
  @ApiResponse({ status: 200, description: 'Message deleted successfully.' })
  async deleteMessage(@Req() req: CustomRequest, @Param('messageId') messageId: number) {
    const senderId = req.user.userId;
    return this.chatService.deleteMessage(Number(messageId), senderId);
  }

  @ApiBearerAuth()
  @Delete('chatRoom/:chatRoomId/messages')
  @Roles(Role.ADMIN) // Only Admins can delete all messages in a chat room
  @ApiOperation({ summary: 'Delete all messages in a chat room' })
  @ApiResponse({ status: 200, description: 'All messages in the chat room have been deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  async deleteAllMessagesInRoom(
    @Req() req: CustomRequest, 
    @Param('chatRoomId') chatRoomId: string // chatRoomId as string
  ) {
    const parsedChatRoomId = Number(chatRoomId); // Convert chatRoomId to number
    if (isNaN(parsedChatRoomId)) {
      throw new Error('chatRoomId must be a valid number');
    }
    
    return this.chatService.deleteAllMessagesInRoom(parsedChatRoomId); // Pass the parsed chatRoomId
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':chatRoomId/close')
  @Roles(Role.ADMIN) // Ensure only admins can close chat rooms
  @ApiOperation({ summary: 'Close a chat room' })
  @ApiResponse({ status: 200, description: 'The chat room has been successfully closed.' })
  async closeChatRoom(
    @Param('chatRoomId') chatRoomId: number,
    @Body() closeChatRoomDto: CloseChatRoomDto, // Use DTO to validate concludingMessage
    @Req() req: CustomRequest,
  ) {
    const adminId = req.user.userId; // Get admin ID from the request
    return this.chatService.closeChatRoom(Number(chatRoomId), closeChatRoomDto.concludingMessage, adminId);
  }

  
}


