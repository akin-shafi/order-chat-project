/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrderModule } from './order/order.module';
import { ChatModule } from './chat/chat.module';
import { EmailModule } from './email/email.module'; // Import EmailModule

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    OrderModule,
    ChatModule,
    EmailModule, // Add EmailModule to imports
  ],
})
export class AppModule {}





