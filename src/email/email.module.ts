/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService], // Export EmailService
})
export class EmailModule {}
