/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailService } from '../email/email.service'; // Import EmailService

@Module({
  imports: [PrismaModule],
  providers: [ChatService, EmailService], // Add EmailService to providers
  controllers: [ChatController],
})
export class ChatModule {}

