/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Use any email service you prefer
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendWelcomeEmail(email: string) {
    const subject = 'Welcome to Our Service!';
    const text = 'Thank you for registering.';
    const html = '<h1>Welcome!</h1><p>Thank you for registering.</p>';

    await this.sendMail(email, subject, text, html);
  }

  async sendChatSummaryEmail(email: string, chatSummary: string) {
    const subject = 'Chat Room Closed - Summary';
    const text = 'Your chat room has been closed. Here is the summary of your conversation:';
    const html = `<h1>Chat Room Closed</h1><p>${chatSummary}</p>`;

    await this.sendMail(email, subject, text, html);
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const subject = 'Password Reset Request';
    const text = `Please use the following token to reset your password: ${token}`;
    const html = `<h1>Password Reset Request</h1><p>Please use the following token to reset your password:</p><p>${token}</p>`;

    await this.sendMail(email, subject, text, html);
  }
}

