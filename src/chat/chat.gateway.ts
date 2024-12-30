/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Logger } from '@nestjs/common';
  import { Server, Socket } from 'socket.io';
  import { ChatService } from './chat.service';
  import { MessageDto } from './dto/message.dto'; // Create DTO for messages
  
  @WebSocketGateway({ cors: true })
  export class ChatGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('ChatGateway');
  
    constructor(private readonly chatService: ChatService) {}
  
    afterInit(server: Server) {
      this.logger.log('Initialized', server);
    }
  
    handleConnection(client: Socket, ...args: any[]) {
      this.logger.log(`Client connected: ${client.id}`);
    }


  
    handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('sendMessage')
    async handleMessage(client: Socket, payload: MessageDto) {
      const { chatRoomId, senderId, content } = payload;
      await this.chatService.sendMessage(chatRoomId, senderId, { content });
      this.server.to(chatRoomId.toString()).emit('newMessage', payload);
    }
  
    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, chatRoomId: string) {
      client.join(chatRoomId);
      this.logger.log(`Client ${client.id} joined room ${chatRoomId}`);
    }
  
    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(client: Socket, chatRoomId: string) {
      client.leave(chatRoomId);
      this.logger.log(`Client ${client.id} left room ${chatRoomId}`);
    }
  }
  