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
    it('should register a new user', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'P@ssword',
          role: Role.USER,
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body).toHaveProperty('email', 'test@example.com');
        });
    });

    it('should login the user', async () => {
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: 'P@ssword',
          role: Role.USER,
        },
      });

      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'P@ssword',
        })
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('token');
          expect(response.body).toHaveProperty('role');
        });
    });
  });

  describe('Chat', () => {
    let token: string;

    beforeAll(async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'P@ssword',
        });
      token = loginResponse.body.token;
    });

    it('should send a message in a chat room', async () => {
      const user = await prisma.user.findFirst({
        where: { email: 'test@example.com' },
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

      return request(app.getHttpServer())
        .post(`/chat/${chatRoom.id}/messages`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'Hello, world!',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body).toHaveProperty('content', 'Hello, world!');
        });
    });

    it('should fetch messages from a chat room', async () => {
      const chatRoom = await prisma.chatRoom.findFirst({
        where: { status: ChatRoomStatus.OPEN },
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
