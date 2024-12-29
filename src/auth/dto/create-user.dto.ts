/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty decorator
import { Role } from '../../role.enum'; // Import Role enum 

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' }) // Swagger example
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123' }) // Swagger example
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'ADMIN', enum: Role }) // Swagger example
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
