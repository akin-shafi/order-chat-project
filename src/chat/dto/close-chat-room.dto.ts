/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CloseChatRoomDto {
  @ApiProperty({ example: 'Thank you for chatting!' })
  @IsString()
  @IsNotEmpty()
  concludingMessage: string;
}
