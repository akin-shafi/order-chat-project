/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { randomBytes } from 'crypto'; // Import randomBytes

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private prisma: PrismaService,
    private emailService: EmailService, // Inject EmailService
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    await this.emailService.sendWelcomeEmail(user.email); // Send welcome email
    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      return { message: 'Invalid credentials' };
    }
    const token = this.jwtService.sign({ email: user.email, sub: user.id, role: user.role });
    return {
      // token: this.jwtService.sign(token),
      statusCode: 200,
      token,
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const token = randomBytes(32).toString('hex');
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1); // Token is valid for 1 hour

    // Type correction here
    await this.prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: token,
        resetPasswordExpiry: expiry,
      } as any, // Type assertion
    });

    await this.emailService.sendResetPasswordEmail(email, token);
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: { resetPasswordToken: token, resetPasswordExpiry: { gte: new Date() } } as any, // Type assertion
    });
    if (!user) {
      throw new Error('Invalid or expired token');
    }

    const hashedPassword = await this.userService.hashPassword(newPassword);
    await this.prisma.user.update({
      where: { email: user.email },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiry: null,
      }as any, // Type assertion
    });
  }
}
