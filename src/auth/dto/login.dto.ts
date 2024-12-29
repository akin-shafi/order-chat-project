/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty decorator

export class LoginDto {
  @ApiProperty({ example: 'sakinropo@gmail.com' }) // Swagger example
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'P@ssword' }) // Swagger example
  @IsString()
  @IsNotEmpty()
  password: string;
}