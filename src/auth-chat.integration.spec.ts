/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module'; // Ensure this path is correct
import { PrismaService } from '../src/prisma/prisma.service';
import { Role, OrderStatus, ChatRoomStatus } from '@prisma/client'; // Import Prisma enums

describe('Auth and Chat Integration', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('Auth', () => {
    beforeAll(async () => {
      const userExists = await prisma.user.findUnique({
        where: {
          email: 'sakinropo@gmail.com',
        },
      });

      if (!userExists) {
        await request(app.getHttpServer())
          .post('/auth/register')
          .send({
            email: 'sakinropo@gmail.com',
            password: 'P@ssword',
            role: Role.USER,
          })
          .expect(201);
      }

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'sakinropo@gmail.com',
          password: 'P@ssword',
        });

      expect([200, 201]).toContain(loginResponse.status);
      token = loginResponse.body.token;
    });

    it('should login the user if already exists', async () => {
      expect(token).toBeDefined();
    });
  });

  describe('Chat', () => {
    beforeAll(async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'sakinropo@gmail.com',
          password: 'P@ssword',
        });
      token = loginResponse.body.token;
    });

    it('should send a message in a chat room', async () => {
      const user = await prisma.user.findFirst({
        where: { email: 'sakinropo@gmail.com' },
      });

      const order = await prisma.order.create({
        data: {
          description: 'Test order',
          specifications: 'Test specs',
          quantity: 10,
          status: OrderStatus.REVIEW,
          userId: user.id,
        },
      });

      const chatRoom = await prisma.chatRoom.create({
        data: {
          orderId: order.id,
          status: ChatRoomStatus.OPEN,
        },
      });

      await request(app.getHttpServer())
        .post(`/chat/${chatRoom.id}/messages`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'Hello, world!',
        })
        .expect(201);
    });

    it('should fetch messages from a chat room', async () => {
      const user = await prisma.user.findFirst({
        where: { email: 'sakinropo@gmail.com' },
      });

      const chatRoom = await prisma.chatRoom.findFirst({
        where: { status: ChatRoomStatus.OPEN },
      });

      await prisma.message.create({
        data: {
          content: 'Hello, world!',
          senderId: user.id,
          chatRoomId: chatRoom.id,
        },
      });

      return request(app.getHttpServer())
        .get(`/chat/${chatRoom.id}/messages`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toBeInstanceOf(Array);
          expect(response.body.length).toBeGreaterThan(0);
        });
    });
  });
});
