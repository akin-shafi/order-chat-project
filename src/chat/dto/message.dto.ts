/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  chatRoomId: any;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  senderId: any;

  @ApiProperty({ example: 'Hello, this is a new message!' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
