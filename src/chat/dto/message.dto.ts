/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  chatRoomId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  senderId: number;

  @ApiProperty({ example: 'Hello, this is a new message!' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
