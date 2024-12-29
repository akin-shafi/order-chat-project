/* eslint-disable prettier/prettier */
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 'New Order Description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Order Specifications' })
  @IsString()
  @IsNotEmpty()
  specifications: string;

  @ApiProperty({ example: 10 })
  @IsInt()
  @IsNotEmpty()
  quantity: number;
}

