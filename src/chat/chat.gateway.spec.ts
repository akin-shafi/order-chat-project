/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';
import { MessageDto } from './dto/message.dto'; // Ensure this path is correct
import { Namespace, Server, Socket } from 'socket.io';
import { createServer } from 'http';

let namespace: Namespace;

describe('ChatGateway', () => {
  let chatGateway: ChatGateway;
  let chatService: ChatService;
  let server: Server;
  let client: Socket;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        {
          provide: ChatService,
          useValue: {
            sendMessage: jest.fn(),
            // Add more mocked services if necessary
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    chatGateway = module.get<ChatGateway>(ChatGateway);
    chatService = module.get<ChatService>(ChatService);

    server = new Server(createServer());
    namespace = server.of('/test-namespace'); // Create a namespace for the socket

    client = {
      id: 'test-client-id',
      join: jest.fn(() => {}),
      leave: jest.fn(() => {}),
      emit: jest.fn(),
      // Mock necessary properties like 'protocol'
      handshake: { protocol: 'http', query: {} },
    } as unknown as Socket;

    chatGateway.server = server;
  });

  it('should be defined', () => {
    expect(chatGateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should log client connection', () => {
      const spy = jest.spyOn(Logger.prototype, 'log');
      chatGateway.handleConnection(client);
      expect(spy).toHaveBeenCalledWith(`Client connected: ${client.id}`);
    });
  });

  describe('handleDisconnect', () => {
    it('should log client disconnection', () => {
      const spy = jest.spyOn(Logger.prototype, 'log');
      chatGateway.handleDisconnect(client);
      expect(spy).toHaveBeenCalledWith(`Client disconnected: ${client.id}`);
    });
  });

  describe('handleMessage', () => {
    it('should send a message through chatService and emit newMessage', async () => {
      // Use strings for roomId and userId to match test setup
      const roomId = '1';
      const userId = '1';
      const payload: MessageDto = {
        chatRoomId: roomId,
        senderId: userId,
        content: 'Hello!',
      };

      const sendMessageSpy = jest.spyOn(chatService, 'sendMessage').mockResolvedValue(null);

      const emitMock = jest.fn(); // Mock the `emit` method
      const toSpy = jest.spyOn(chatGateway.server, 'to').mockReturnValue({
        emit: emitMock,
      } as any); // Use type assertion to satisfy TypeScript

      await chatGateway.handleMessage(client, payload);

      // Ensure roomId and userId are strings to match expected values
      expect(sendMessageSpy).toHaveBeenCalledWith(roomId, userId, { content: 'Hello!' });
      expect(toSpy).toHaveBeenCalledWith(roomId);
      expect(emitMock).toHaveBeenCalledWith('newMessage', payload);
    });
  });

  describe('handleJoinRoom', () => {
    it('should join the specified room and log it', () => {
      const spy = jest.spyOn(Logger.prototype, 'log');
      const joinSpy = jest.spyOn(client, 'join').mockImplementation((room: string) => {
        return; // Ensure it returns void
      });

      chatGateway.handleJoinRoom(client, '1');

      expect(joinSpy).toHaveBeenCalledWith('1');
      expect(spy).toHaveBeenCalledWith(`Client ${client.id} joined room 1`);
    });
  });

  describe('handleLeaveRoom', () => {
    it('should leave the specified room and log it', () => {
      const spy = jest.spyOn(Logger.prototype, 'log');
      const leaveSpy = jest.spyOn(client, 'leave').mockImplementation((room: string) => {
        return; // Ensure it returns void
      });

      chatGateway.handleLeaveRoom(client, '1');

      expect(leaveSpy).toHaveBeenCalledWith('1');
      expect(spy).toHaveBeenCalledWith(`Client ${client.id} left room 1`);
    });
  });
});
