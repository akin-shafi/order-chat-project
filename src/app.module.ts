/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrderModule } from './order/order.module';
import { ChatModule } from './chat/chat.module';
import { EmailModule } from './email/email.module'; // Import EmailModule
import { WinstonModule } from 'nest-winston'; 
import * as winston from 'winston';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Serve files from the public directory
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    OrderModule,
    ChatModule,
    EmailModule, // Add EmailModule to imports
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`),
          ),
        }),
      ],
    }),
  ],
  controllers: [AppController], // Ensure controllers is inside Module metadata
  providers: [AppService],      // Ensure providers is inside Module metadata
})
export class AppModule {}
